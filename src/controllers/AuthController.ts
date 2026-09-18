import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LoginDto } from "../dtos/LoginDto";
import { CreateUserDto } from "../dtos/CreateUserDto";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const user = await authService.register(req.body as CreateUserDto);
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const result = await authService.login(req.body as LoginDto);
    return res.status(200).json(result);
  }
}
