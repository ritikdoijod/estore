import argon2 from "argon2";
import type { Job } from "bullmq";
import { Worker } from "bullmq";
import crypto from "crypto";
import { logger } from "./logger.js";
import { redis } from "./redis.js";
import { getRegisterSession } from "./utils";

type SendRegisterOTPJobData = {
  sessionId: string;
};

const worker = new Worker(
  "otp",
  async (job: Job<SendRegisterOTPJobData>) => {
    if (job.name === "send-register-otp") {
      const otp = crypto.randomInt(100000, 999999).toString();
      const sessionId = job.data.sessionId;
      const session = await getRegisterSession(sessionId);

      if (!session) {
        logger.error({ sessionId }, "Invalid session id");
      }

      // TODO: Implements send email functionality and remove console log
      logger.info({ session, otp }, "send register");

      const otpHash = await argon2.hash(otp);

      await redis.set(
        `auth:register:otp:${job.data.sessionId}`,
        otpHash,
        "EX",
        300,
      );
      await redis.set(`auth:otp:cooldown:${job.data.sessionId}`, "1", "EX", 60);
    }
  },
  {
    connection: redis,
  },
);

logger.info({ worker }, "worker started");
