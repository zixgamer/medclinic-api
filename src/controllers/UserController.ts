import { Request, Response } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../database/data-source";

export class UserController {
  async me(req: Request, res: Response): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: req.user?.id },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não foi encontrado" });
    }

    const { password: _password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  }
}
