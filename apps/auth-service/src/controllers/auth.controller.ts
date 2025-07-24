import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
} from '../utils/auth.helper';
import { prisma } from '@estore/libs/prisma';
import { ValidationException } from '@estore/middlewares';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(email, name, 'user-activation-mail');
    res.status(200).json({
      message: 'OTP sent to email. Please verify your account.',
    });
  } catch (error) {
    return next(error);
  }
};
