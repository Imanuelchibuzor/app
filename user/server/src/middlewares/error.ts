import type { Request, Response, NextFunction } from "express";
import AppError from "../configs/error";

const isProd = process.env.NODE_ENV === "production";

type ErrorPayload = {
  status: "fail" | "error";
  message: string;
  code?: string;
  details?: unknown;
};

// Centralized error middleware
function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Normalize into AppError
  const error =
    err instanceof AppError
      ? err
      : err instanceof Error
      ? new AppError(err.message || "Internal Server Error", 500, {
          isOperational: false,
        })
      : new AppError("Unknown error", 500, { isOperational: false });

  // Basic logging (swap for pino/winston later)
  // eslint-disable-next-line no-console
  console.error({
    time: new Date().toISOString(),
    message: error.message,
    code: (error as any).code,
    statusCode: error.statusCode,
    stack: !isProd ? error.stack : undefined,
  });

  const payload: ErrorPayload = {
    status: error.statusCode >= 500 ? "error" : "fail",
    message: error.isOperational ? error.message : "Something went wrong",
  };

  if ((error as any).code) payload.code = (error as any).code;
  if (!isProd && error.stack) payload.details = error.stack;

  res.status(error.statusCode).json(payload);
}

export default errorMiddleware;
