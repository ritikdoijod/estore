import { redis } from "./redis.js";
import type { Job } from "bullmq";
import { Worker } from "bullmq";
import crypto from "crypto";
import argon2 from "argon2"
import { getRegisterSession } from "./utils";

type SendRegisterOTPJobData = {
  sessionId: string
};

const worker = new Worker(
  "otp",
  async (job: Job<SendRegisterOTPJobData>) => {
    if (job.name === "send-register-otp") {
      const otp = crypto.randomInt(100000, 999999).toString();
      const session = await getRegisterSession(job.data.sessionId)

      // TODO: Implements send email functionality and remove console log
      console.log(`send register otp: ${session.email} - ${otp}`)

      const otpHash = await argon2.hash(otp);

      await redis.set(`auth:register:otp:${job.data.sessionId}`, otpHash, "EX", 300);
      await redis.set(`auth:otp:cooldown:${job.data.sessionId}`, "1", "EX", 60);
    }
  },
  {
    connection: redis,
  },
);

console.log('Worker started')
