import "dotenv/config";
import express from "express";
import aiRouter from "./routes/ai.routes";

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Elevare AI Backend!");
});

app.use("/api/ai", aiRouter);

export default app;
