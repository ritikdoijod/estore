import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Response {
    success: (options?: { data?: any; statusCode?: number }) => void;
  }
}

const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
  res.success = ({ data, statusCode = 200 } = {}) => {
    res.status(statusCode).json({
      success: true,
      data,
    });
  };

  next();
};

export { responseFormatter };
