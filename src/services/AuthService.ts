import { UserRepository } from "../repositories/UserRepository";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { LoginDto } from "../dtos/LoginDto";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

export class AuthService {
  private userRepository = new UserRepository();

  async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new AppError("Esse email já está cadastrado", 409);
    }

    const savedUser = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: await hashPassword(dto.password),
      role: "atendente",
    });

    const { password: _password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordIsValid = await comparePassword(dto.password, user.password);

    if (!passwordIsValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = generateToken({ id: user.id, role: user.role });
    return { token };
  }
}
