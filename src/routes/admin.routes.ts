import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  "/super",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler((req, res) => adminController.super(req, res)),
);

export default adminRoutes;