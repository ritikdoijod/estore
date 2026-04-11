import argon2 from "argon2";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createUser, findUserByEmail, findUserById } from "./db";
import {
  enforceRegistrationRateLimit,
  createRegisterSession,
  enforceVerificationRateLimit,
  getRegisterSession,
  verifyOTP,
  enforceResendOTPRateLimit,
  signToken,
} from "./utils";
import { addSendRegisterOTPJob } from "./queue";

const router = new Hono();

router.post("/register", async (c) => {
  const payload = await c.req.json();

  const existingUser = await findUserByEmail(payload.email);

  if (existingUser)
    throw new HTTPException(400, {
      message: `User already exist with email: ${payload.email}`,
    });

  await enforceRegistrationRateLimit(payload.email);

  const hashedPassword = await argon2.hash(payload.password);
  const sessionId = await createRegisterSession({
    ...payload,
    password: hashedPassword,
  });

  await addSendRegisterOTPJob(sessionId);

  return c.json({ sessionId });
});

router.post("/verify", async (c) => {
  const payload = await c.req.json();
  await enforceVerificationRateLimit(payload.sessionId);

  const session = await getRegisterSession(payload.sessionId);

  if (!session) throw new HTTPException(400, { message: "Invalid sessionId" });

  await verifyOTP(payload.sessionId, payload.otp);

  await createUser(session);

  return c.json({ message: "User registered successfully" });
});

router.post("/resend-otp", async (c) => {
  const payload = await c.req.json();
  await enforceResendOTPRateLimit(payload.sessionId);

  const session = await getRegisterSession(payload.sessionId);

  if (!session) throw new HTTPException(400, { message: "Invalid sessionId" });

  await addSendRegisterOTPJob(payload.sessionId);
  return c.json({ message: "OTP will be sent via mail" });
});

router.post("/login", async (c) => {
  const payload = await c.req.json();
  const user = await findUserByEmail(payload.email);

  if (!user) throw new HTTPException(401, { message: "Invalid credentials" });

  const accessToken = signToken({ userId: user.id });

  return c.json({ accessToken });
});

export default router;
