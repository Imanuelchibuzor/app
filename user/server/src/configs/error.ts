export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    opts?: { code?: string; isOperational?: boolean; details?: unknown }
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = opts?.isOperational ?? true;
    this.code = opts?.code;
    this.details = opts?.details;
    Error.captureStackTrace(this);
  }
}
