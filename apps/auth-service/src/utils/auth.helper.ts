import crypto from 'crypto';
import { ValidationException } from '@estore/middlewares';
import { NextFunction } from 'express';
import { redis } from '@estore/libs/redis';
import { sendEmail } from './mail.helper';

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

export async function checkOtpRestrictions(email: string, next: NextFunction) {
  if (await redis.get(`otp_lock:${email}`))
    return next(
      new ValidationException(
        'Account locked due to multiple failed attempts! Try again after 30 minutes'
      )
    );

  if (await redis.get(`otp_spam_lock:${email}`))
    return next(
      new ValidationException(
        'Tomo many OTP requests! Please wait 1 hour before sending request again.'
      )
    );

  if (await redis.get(`otp_cooldown:${email}`))
    return next(
      new ValidationException(
        'Please wait 1 minute before requesting a new OTP!'
      )
    );
}

export async function trackOtpRequests(email: string, next: NextFunction) {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600);
    return next(
      new ValidationException(
        'Tomo many OTP requests! Please wait 1 hour before sending request again.'
      )
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600);
}

export async function sendOtp(name: string, email: string, template: string) {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, 'Verify Your Email', template, { name, otp });
  await redis.set(`otp:${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
}
