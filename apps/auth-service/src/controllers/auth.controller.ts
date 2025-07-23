import { NextFunction, Request, Response } from 'express';
import { validateRegistrationData } from '../utils/auth.helper';
import { prisma } from '@estore/libs/prisma';
import { ValidationException } from '@estore/middlewares';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Add zod validation
  validateRegistrationData(req.body, 'user');
  const { name, email } = req.body;

  const existingUser = await prisma.users.findUnique({ where: { email } });

  //   TODO: add error handler
  if (existingUser) {
    return next(
      new ValidationException('User already exists with this email!')
    );
  }
};
