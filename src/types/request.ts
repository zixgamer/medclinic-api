export {};

declare module "express" {
  export interface Request {
    user?: { id: number; role: string };
    queryDto?: any;
  }
}
