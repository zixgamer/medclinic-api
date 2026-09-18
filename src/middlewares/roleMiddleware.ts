import { Request, Response, NextFunction } from "express";

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Seu acesso foi negado" });
      return;
    }
    next();
  };
}
