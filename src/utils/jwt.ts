import { sign, verify } from "jsonwebtoken";

export function generateToken(payload: any) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido");
  }

  return sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as any,
    issuer: "Senai",
  });
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido");
  }

  return verify(token, process.env.JWT_SECRET, {
    issuer: "Senai",
  });
}
