import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();

export class UserController {
  async me(req: Request, res: Response): Promise<Response> {
    const user = await userRepository.findById(req.user!.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não foi encontrado" });
    }

    const { password: _password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  }
}
