import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import AppError from "../configs/error";

type AuthPayload = JwtPayload | Record<string, any> | string;

const getToken = (req: Request, res: Response, next: NextFunction): void | Response => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Unauthorized: No token provided", 401, { code: "UNAUTHORIZED" });
  }

  const secret: Secret = process.env.JWT_SECRET as Secret;
  const decoded = jwt.verify(token, secret) as AuthPayload;
  (req as unknown as { user?: AuthPayload }).user = decoded;
  return next();
};

module.exports = getToken;