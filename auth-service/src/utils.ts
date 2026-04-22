import argon2 from "argon2";
import { HTTPException } from "hono/http-exception";
import * as jose from "jose";
import { config } from "./config";
import { redis } from "./redis";

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
  return result ? { id, ...JSON.parse(result) } : null;
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

  await redis.set(`auth:register:cooldown:${email}`, "1", "EX", 5 * 60);
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

export async function signAccessToken(subject: string) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  return new jose.SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

export async function signRefreshToken(subject: string) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  return new jose.SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export function verifyAccessToken(token: string) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  return jose.jwtVerify(token, secret);
}

export function verifyRefreshToken(token: string) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  return jose.jwtVerify(token, secret);
}
