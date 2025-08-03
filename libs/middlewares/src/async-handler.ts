import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(
  controller: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler {
  return async function (req, res, next) {
    try {
      return await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
