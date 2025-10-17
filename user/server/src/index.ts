import express from "express";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import cors from "./configs/cors";
import connectDB from "./configs/db";
import errorHandler from "./middlewares/error";

// Initialize express and dotenv
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy
app.set("trust proxy", true);

// Middleware
app.use(cors);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

// Routes
app.get("/", (_req: Request, res: Response): void => {
  res.send("...");
});

app.get("/favicon.ico", (_req: Request, res: Response): void => {
  res.status(204).end();
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});