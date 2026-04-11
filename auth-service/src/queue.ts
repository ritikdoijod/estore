import { redis } from "./redis";
import { Queue } from "bullmq";

const otpQueue = new Queue("otp", {
  connection: redis,
});

export async function addSendRegisterOTPJob(sessionId: string) {
  await otpQueue.add("send-register-otp", { sessionId });
}
