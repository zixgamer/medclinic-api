import { Request, Response } from "express";

export class AdminController {
  async super(req: Request, res: Response): Promise<Response> {
    return res
      .status(200)
      .json({ message: "Acesso concedido!! Você é um Administrador" });
  }
}
