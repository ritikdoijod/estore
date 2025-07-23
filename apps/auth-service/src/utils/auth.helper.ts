import crypto from 'crypto';
import { ValidationException } from '@estore/middlewares';
import { NextFunction } from 'express';
import { redis } from '@estore/libs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: 'user' | 'seller'
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    throw new ValidationException(`Missing required fields`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationException('Invalid email format!');
  }
};

export function checkOtpRestrictions(email: string, next: NextFunction) {}

export async function sendOtp(name: string, email: string, template: string) {
  const opt = crypto.randomInt(1000, 9999).toString();
  await redis.set(`otp:${email}`, opt, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
}
