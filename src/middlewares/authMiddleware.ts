import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: "Token não encontrado" });
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }

  try {
    const payload = verifyToken(token) as {
      data: { id: number; role: string };
    };
    req.user = payload.data;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
