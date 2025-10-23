import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    // payload you put on req.user after auth
    interface Request {
      user?: JwtPayload & { id: string };
    }
  }
}