import { AppDataSource } from "../database/data-source";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../entities/User";
import { LoginDto } from "../dtos/LoginDto";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new AppError("Esse email já está cadastrado", 409);
    }

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: await hashPassword(dto.password),
      role: "atendente",
    });

    const savedUser = await this.userRepository.save(user);

    const { password: _password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const passowrdIsValid = await comparePassword(dto.password, user.password);

    if (!passowrdIsValid) {
      throw new AppError("Senha inválida", 401);
    }

    const token = generateToken({ id: user.id, role: user.role });

    return { token };
  }
}
