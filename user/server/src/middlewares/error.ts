import type { Request, Response, NextFunction } from "express";
import AppError from "../configs/error";

const isProd = process.env.NODE_ENV === "production";

function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const error =
    err instanceof AppError
      ? err
      : new AppError((err as Error)?.message ?? "Internal Error", 500, {
          isOperational: false,
        });

  // Basic server-side logging to console
  console.error({
    message: error.message,
    code: error.code,
    stack: !isProd ? error.stack : undefined,
  });

  // Safe response to client
  res.status(error.statusCode).json({
    status: error.statusCode >= 500 ? "error" : "fail",
    message: error.isOperational ? error.message : "Something went wrong",
    code: error.code,
  });
}

export default errorHandler;