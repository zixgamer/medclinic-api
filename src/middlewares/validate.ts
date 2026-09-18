import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(
      dtoClass,
      req.method === "GET" ? req.query : req.body,
    );

    const errors = await validate(dto);

    if (errors.length > 0) {
      const validationErrors = errors.map((error) => ({
        field: error.property,
        message: Object.values(error.constraints ?? {}),
      }));

      throw new AppError(JSON.stringify(validationErrors, null, 2), 400);
    }

    if (req.method === "GET") {
      req["queryDto"] = dto;
    } else {
      req.body = dto;
    }

    next();
  };
}
