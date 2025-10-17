import type { RequestHandler } from "express";

/** Wrap async handlers to forward errors to middleware */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);