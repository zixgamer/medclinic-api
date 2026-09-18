import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { LoginDto } from "../dtos/LoginDto";
import { validateDto } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  "/auth/register",
  validateDto(CreateUserDto),
  asyncHandler((req, res) => authController.register(req, res)),
);

authRoutes.post(
  "/auth/login",
  validateDto(LoginDto),
  asyncHandler((req, res) => authController.login(req, res)),
);

export default authRoutes;
