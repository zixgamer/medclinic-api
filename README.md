# medclinic-api

# MedClinic API

## 1. Descrição

A **MedClinic API** é uma API REST para o gerenciamento de uma clínica médica de pequeno porte. Esta entrega apresenta a construção da base de acesso do sistema, o cadastro de usuários, autenticação e controle de permissões (RBAC).

As funcionalidades de gerenciamento de especialidades, médicos, pacientes e consultas não fazem parte desta entrega e serão implementadas em uma etapa futura, utilizando esta mesma base de código.

## 2. Objetivo

Este projeto foi desenvolvido como mini-projeto avaliativo do Módulo 02 do curso. O objetivo técnico é consolidar os seguintes conceitos:

- Configuração de um projeto Node.js com TypeScript e Express.js.
- Persistência de dados com PostgreSQL utilizando o TypeORM.
- Arquitetura em camadas (MVC), separando responsabilidades.
- Autenticação via login com emissão de token JWT.
- Autorização baseada em perfis de usuário (RBAC).
- Criptografia de senhas e tratamento centralizado de erros.

## 3. Tecnologias utilizadas

- Node.js
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- pg (driver PostgreSQL)
- bcrypt (hash de senhas)
- jsonwebtoken (JWT)
- class-validator / class-transformer (validação de DTOs)
- dotenv
- tsx (execução em desenvolvimento)

## 4. Requisitos para execução

Para rodar este projeto, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior)
- **PostgreSQL** (versão 12.x ou superior)
- **npm** (gerenciador de pacotes, já incluso no Node.js)

## 5. Configuração do banco de dados

1. Acesse o terminal do seu PostgreSQL (ou uma ferramenta como pgAdmin/DBeaver) e crie o banco de dados:

```sql
CREATE DATABASE medclinic;
```

2. A estrutura da tabela `users` é criada automaticamente pelo TypeORM ao iniciar a aplicação (`synchronize: true`). Um script de referência com essa mesma estrutura está disponível em `src/database/schema.sql`, caso prefira criar a tabela manualmente:

```
psql -U postgres -d medclinic -f src/database/schema.sql
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (veja `.env.example` como referência):

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=medclinic

JWT_SECRET=uma_chave_secreta_bem_dificil_de_adivinhar
JWT_EXPIRES_IN=1h
```

## 6. Instalação

1. Clone o repositório para a sua máquina:

```
git clone https://github.com/SEU_USUARIO/medclinic-api.git
cd medclinic-api
```

2. Instale as dependências do projeto:

```
npm install
```

3. Configure o arquivo `.env` conforme descrito na seção anterior.

## 7. Execução

Para iniciar o servidor em modo de desenvolvimento (com reinício automático a cada alteração):

```
npm run dev
```

Para gerar a build de produção e executá-la:

```
npm run build
npm start
```

Se tudo estiver correto, o terminal exibirá:

```
Conexão com o banco de dados foi estabelecida
Servidor rodando na porta 3000
```

## 8. Arquitetura do projeto

O sistema segue uma arquitetura MVC organizada em camadas, já preparada para receber os módulos de domínio da clínica em uma etapa futura:

O fluxo de uma requisição começa nas Routes, responsáveis por definir os endpoints e associá-los aos middlewares e controllers corretos. Antes de chegar ao controller, a requisição pode passar por Middlewares: o `validate` valida o corpo/query com base em um DTO, o `authMiddleware` valida o token JWT, e o `roleMiddleware` verifica se o perfil do usuário autenticado tem permissão para acessar aquele recurso.

Os Controllers recebem a requisição HTTP já validada, chamam a camada de Services, que concentra as regras de negócio (verificar duplicidade de e-mail, comparar senhas, gerar tokens), e os services acessam o banco de dados através dos Repositories do TypeORM. As Entities representam as tabelas do banco via decorators, a camada Database centraliza a conexão (`data-source.ts`), e os Utils reúnem funções auxiliares reutilizáveis (hash de senha, geração/verificação de JWT). Qualquer erro lançado em qualquer camada é capturado pelo middleware central de tratamento de erros (`errorHandler`), que sempre é o último middleware registrado na aplicação.

```
Cliente HTTP -> Route -> Middleware (Auth/RBAC) -> Controller -> Service -> Repository (TypeORM) -> PostgreSQL
```

## 9. Perfis de acesso (RBAC)

O sistema possui dois perfis de usuário:

| Perfil      | Descrição                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `atendente` | Perfil padrão atribuído automaticamente a todo novo cadastro. Acesso operacional restrito.                                              |
| `admin`     | Acesso completo, incluindo rotas administrativas. Promoção feita manualmente no banco de dados (não há endpoint para isso nesta etapa). |

Para promover um usuário a administrador:

```sql
UPDATE users SET role = 'admin' WHERE email = 'email@do-usuario.com';
```

> Importante: como o perfil (`role`) é embutido no token JWT no momento do login, é necessário fazer login novamente após a promoção para obter um token atualizado.

## 10. Endpoints da API

### `POST /auth/register`

Cadastra um novo usuário. O perfil é sempre `atendente`.

**Body:**

```json
{
  "name": "Fulano de Tal",
  "email": "fulano@email.com",
  "password": "123456"
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "name": "Fulano de Tal",
  "email": "fulano@email.com",
  "role": "atendente",
  "createdAt": "2026-09-18T12:00:00.000Z"
}
```

Erros possíveis: `400` (dados inválidos), `409` (e-mail já cadastrado).

### `POST /auth/login`

Autentica um usuário e retorna um token JWT.

**Body:**

```json
{
  "email": "fulano@email.com",
  "password": "123456"
}
```

**Resposta (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Erros possíveis: `400` (dados inválidos), `401` (credenciais inválidas).

### `GET /users/me`

Retorna os dados do usuário autenticado. Requer header `Authorization: Bearer <token>`.

**Resposta (200):**

```json
{
  "id": 1,
  "name": "Fulano de Tal",
  "email": "fulano@email.com",
  "role": "atendente",
  "createdAt": "2026-09-18T12:00:00.000Z"
}
```

Erros possíveis: `401` (token ausente, inválido ou expirado).

### `GET /admin/ping`

Endpoint protegido, acessível apenas por usuários com perfil `admin`. Requer header `Authorization: Bearer <token>`.

**Resposta (200):**

```json
{
  "message": "Acesso concedido!! Você é um Administrador"
}
```

Erros possíveis: `401` (token ausente/inválido), `403` (usuário autenticado, mas sem permissão).

## 11. Estrutura das pastas

```
medclinic-api/
├── src/
│   ├── controllers/      # Recebe as requisicoes HTTP e retorna as respostas
│   ├── services/         # Regras de negocio da aplicacao
│   ├── repositories/     # Acesso ao banco via TypeORM (implicito nos services)
│   ├── entities/         # Entidades do TypeORM (User)
│   ├── database/         # Conexao com o banco (data-source.ts) e schema.sql
│   ├── dtos/             # Data Transfer Objects com validacao
│   ├── middlewares/      # asyncHandler, errorHandler, validate, authMiddleware, roleMiddleware
│   ├── routes/           # Definicao dos endpoints
│   ├── errors/           # Classe AppError
│   ├── types/            # Extensao de tipos do Express (req.user, req.queryDto)
│   ├── utils/            # password.ts (bcrypt), jwt.ts (jsonwebtoken)
│   ├── app.ts            # Configuracao do Express
│   └── server.ts         # Ponto de entrada (Entrypoint) da aplicacao
├── .env.example          # Template das variaveis de ambiente
├── package.json          # Dependencias do Node e scripts
└── tsconfig.json         # Configuracao do compilador TypeScript
```

## 12. Testando a aplicação

Recomenda-se o uso do **Insomnia** ou **Postman** para testar os endpoints:

1. Registre um usuário em `POST /auth/register`.
2. Faça login em `POST /auth/login` e copie o token retornado.
3. Use o token no header `Authorization: Bearer <token>` para acessar `GET /users/me`.
4. Promova o usuário a `admin` diretamente no banco, faça login novamente, e acesse `GET /admin/ping`.
5. Teste também os cenários de erro: e-mail duplicado, credenciais inválidas, requisição sem token e acesso de um `atendente` à rota administrativa.

## 13. Integrante

- Gabriel Vitkoshi
