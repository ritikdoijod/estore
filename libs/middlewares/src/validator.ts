import { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

import { BadRequestException } from "./error-handler.js";

type ValidateSchemas = {
  params?: ZodObject;
  query?: ZodObject;
  body?: ZodObject;
};

export function validate({ params, query, body }: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ path: string; errors: any[] }> = [];

    function parse(schema: ZodObject, data: unknown, path: string) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        errors.push({
          path,
          errors: parsed.error.issues.map((issue) => ({
            ...issue,
            path: issue.path.join("."), // flatten Zod path array into a string
          })),
        });
      }
    }

    if (params) parse(params, req.params, "params");
    if (query) parse(query, req.query, "query");
    if (body) parse(body, req.body, "body");

    if (errors.length > 0) {
      return next(new BadRequestException("Invalid Request", errors));
    }

    next();
  };
}
