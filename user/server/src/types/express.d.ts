import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    // adjust the type to your expected payload shape
    interface Request {
      user?: JwtPayload | Record<string, any> | string;
    }
  }
}
