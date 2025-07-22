import crypto from 'crypto';
import { ValidationException } from '@estore/middlewares';

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
