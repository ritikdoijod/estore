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
  signAccessToken,
} from "./utils";
import { addSendRegisterOTPJob } from "./queue";
import { sValidator } from "@hono/standard-validator";
import z from "zod";

const router = new Hono();

router.post(
  "/sign-up",
  sValidator(
    "json",
    z.object({
      firstName: z.string().min(3).max(255),
      lastName: z.string().min(1).max(255),
      email: z.email(),
      password: z.string().min(8).max(255),
    }),
  ),
  async (c) => {
    const payload = c.req.valid("json");

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
  },
);

router.post("/verify", async (c) => {
  const payload = await c.req.json();
  await enforceVerificationRateLimit(payload.sessionId);

  const session = await getRegisterSession(payload.sessionId);

  if (!session) throw new HTTPException(400, { message: "Invalid sessionId" });

  await verifyOTP(payload.sessionId, payload.otp);

  const user = await createUser(session);

  const accessToken = await signAccessToken(user.id);

  return c.json({ accessToken });
});

router.post("/resend-otp", async (c) => {
  const payload = await c.req.json();
  await enforceResendOTPRateLimit(payload.sessionId);

  const session = await getRegisterSession(payload.sessionId);

  if (!session) throw new HTTPException(400, { message: "Invalid sessionId" });

  await addSendRegisterOTPJob(payload.sessionId);
  return c.json({ message: "OTP will be sent via mail" });
});

router.post("/sign-in", async (c) => {
  const payload = await c.req.json();
  const user = await findUserByEmail(payload.email);

  if (!user) throw new HTTPException(401, { message: "Invalid credentials" });

  const accessToken = await signAccessToken(user.id);

  return c.json({ accessToken });
});

export default router;
