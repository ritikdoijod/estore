import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  deleteOtp,
  sendOtp,
  trackOtpRequests,
  verifyOtp,
} from "../utils/auth.helper";
import { prisma } from "@estore/db-utils";
import {
  asyncHandler,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from "@estore/middlewares";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async function (
  req: Request,
  res: Response,
) {
  const { name, email, password } = req.body;

  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser)
    throw new BadRequestException("User already exists with this email!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const accessToken = jwt.sign(
    { sub: user.id, role: "user" },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { sub: user.id, role: "user" },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  await sendOtp(name, email, "user-activation-mail");
  return res.success();
});

export const verify = asyncHandler(async function (
  req: Request,
  res: Response,
) {
  const accessToken = req.cookies.access_token;
  const { sub } = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as { sub: string };

  const { otp } = req.body;

  const user = await prisma.users.findUnique({ where: { id: sub } });

  if (!user) throw new BadRequestException("User not found");

  await verifyOtp(user.email, otp);

  await prisma.users.update({
    where: { id: user.id },
    data: {
      isVerified: true,
    },
  });

  return res.success();
});

export const resendOtp = asyncHandler(async function (
  req: Request,
  res: Response,
) {
  const accessToken = req.cookies.access_token;
  const { sub } = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as { sub: string };

  const user = await prisma.users.findUnique({ where: { id: sub } });

  if (!user) throw new BadRequestException("User not found");

  await deleteOtp(user.email);

  await checkOtpRestrictions(user.email);
  await trackOtpRequests(user.email);

  await sendOtp(user.name, user.email, "resend-otp");

  return res.success();
});

export const login = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthorizedException("Invalid Credentials");
  }

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    return next(new UnauthorizedException("Invalid Credentials"));
  }

  if (!(await bcrypt.compare(password, user.password!))) {
    return next(new UnauthorizedException("Invalid Credentials"));
  }

  const accessToken = jwt.sign(
    { sub: user.id, role: "user" },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { sub: user.id, role: "user" },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.success({
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

export const forgotPassword = asyncHandler(async function (
  req: Request,
  res: Response,
) {
  const { email } = req.body;

  if (!email) throw new BadRequestException("Email is required");

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) throw new NotFoundException("User not found!");

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  await sendOtp(user.name, user.email, "forgot-password-user-mail");

  res.success();
});

export const verifyForgotPasswordOTP = asyncHandler(async function (
  req: Request,
  res: Response,
) {
  const { email, otp } = req.body;

  if (!email || !otp)
    throw new BadRequestException("Email and OTP is required");

  await verifyOtp(email, otp);

  res.success();
});

export const resetPassword = asyncHandler(async function (
  req: Request,
  res: Response,
) {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestException("Email and password is required");

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) throw new NotFoundException("User not found!");

  if (!(await bcrypt.compare(password, user.password!)))
    throw new BadRequestException(
      "New password cannot be same as the old password",
    );

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.users.update({
    where: { email },
    data: { password: hashedPassword },
  });

  res.success();
});
