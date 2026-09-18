import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";

const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(adminRoutes);

export default routes;
