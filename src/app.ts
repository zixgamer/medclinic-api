import "reflect-metadata";
import express, { Express } from "express";
import routes from "./routes/index.routes";
import { errorHandler } from "./middlewares/errorHandler";
import "./types/request";

const app: Express = express();

app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: "A rota não foi encontrada" });
});

app.use(errorHandler);

export default app;
