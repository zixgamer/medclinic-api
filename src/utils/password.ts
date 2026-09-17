import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, await bcrypt.genSalt(10));
}

export function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
