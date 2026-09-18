import "dotenv/config";
import app from "./app";
import { AppDataSource } from "./database/data-source";

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados foi estabelecida");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao estabelecer conexão com o banco de dados", err);
  });
