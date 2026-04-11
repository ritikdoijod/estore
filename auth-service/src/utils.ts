import { redis } from "./redis";
import { HTTPException } from "hono/http-exception";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { config } from "./config";

export async function setCooldown(email: string) {
  return redis.set(`auth:register:cooldown:${email}`, "1", "EX", 300);
}

export async function createRegisterSession(data: any) {
  const id = crypto.randomUUID();
  await redis.set(
    `auth:register:session:${id}`,
    JSON.stringify(data),
    "EX",
    3600,
  );
  return id;
}

export async function getRegisterSession(id: string) {
  const result = await redis.get(`auth:register:session:${id}`);
  return result ? JSON.parse(result) : null;
}

export async function closeRegisterSession(id: string) {
  await redis.del(`auth:register:session:${id}`);
}

export async function deleteOTP(sessionId: string) {
  await redis.del(`auth:register:otp:${sessionId}`);
}

export async function verifyOTP(sessionId: string, otp: string) {
  const otpHash = await redis.get(`auth:register:otp:${sessionId}`);

  if (!otpHash || !(await argon2.verify(otpHash, otp)))
    throw new HTTPException(400, { message: "Invalid OTP or OTP is expired" });

  await deleteOTP(sessionId);
}

export async function enforceRegistrationRateLimit(email: string) {
  if (await redis.get(`auth:register:cooldown:${email}`))
    throw new HTTPException(400, {
      message: "Please wait 5 minutes before sending new request.",
    });

  const attempts = parseInt(
    (await redis.get(`auth:register:attempts:${email}`)) || "0",
  );

  if (attempts > 2)
    throw new HTTPException(400, {
      message:
        "Too many attempts! Please wait 1 hour before sending new request again.",
    });

  await redis.set(`auth:register:attempts:${email}`, attempts + 1, "EX", 3600);
}

export async function enforceVerificationRateLimit(sessionId: string) {
  const attempts = parseInt(
    (await redis.get(`auth:verify:attempts:${sessionId}`)) || "0",
  );

  if (attempts > 2)
    throw new HTTPException(400, {
      message:
        "Too many attempts! Please wait 5 minutes before sending new request again.",
    });

  await redis.set(`auth:verify:attempts:${sessionId}`, attempts + 1, "EX", 300);
}

export async function enforceResendOTPRateLimit(sessionId: string) {
  if (await redis.get(`auth:otp:cooldown:${sessionId}`))
    throw new HTTPException(400, {
      message: "Please wait 1 minutes before sending new request.",
    });

  const attempts = parseInt(
    (await redis.get(`auth:otp:attempts:${sessionId}`)) || "0",
  );

  if (attempts > 2)
    throw new HTTPException(400, {
      message:
        "Too many attempts! Please wait 1 hour before sending new request again.",
    });
}

export function signToken(payload: any) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "5m" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.JWT_SECRET);
}
