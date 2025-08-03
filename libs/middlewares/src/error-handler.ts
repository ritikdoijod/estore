import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not Found Exception
export class NotFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

// Bad Request Exception
export class BadRequestException extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

// Unauthorized Exception
export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Forbidden Exception
export class ForbiddenException extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// Internal Server Exception
export class InternalServerException extends AppError {
  constructor(message = "Internal Server Exception") {
    super(message, 500);
  }
}

// Rate Limit Exception
export class RateLimitException extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(message, 429);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
      error.name,
    )
  ) {
    console.log(error);
    error = new UnauthorizedException(
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : error.name === "JsonWebTokenError"
          ? "Invalid token. Please log in again."
          : "Token is not active yet. Please try again later.",
    );
  }

  if (error instanceof AppError) {
    console.log(
      `ERROR ${req.method} ${req.url} - ${error.message} - ${error.stack}`,
    );

    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  console.log("Unhandled error: ", error);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong, please try again!",
  });
};
