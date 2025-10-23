import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import AppError from "../configs/error";

type JwtUser = JwtPayload & { id: string };

const getToken = (req: Request, res: Response, next: NextFunction): void | Response => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Unauthorized: No token provided", 401, { code: "UNAUTHORIZED" });
  }

  const secret: Secret = process.env.JWT_SECRET as Secret;
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string") {
    // unexpected token shape — treat as invalid
    throw new AppError("Unauthorized: Invalid token payload", 401, { code: "INVALID_TOKEN" });
  }

  const payload = decoded as JwtUser;
  if (!payload.id) {
    throw new AppError("Unauthorized: Invalid token payload (missing id)", 401, {
      code: "INVALID_TOKEN",
    });
  }

  req.user = payload; 
  return next();
};

export default getToken;