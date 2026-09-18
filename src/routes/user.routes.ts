import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get(
  "/me",
  authMiddleware,
  asyncHandler((req, res) => userController.me(req, res)),
);

export default userRoutes;
