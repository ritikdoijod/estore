import crypto from "crypto";
import { BadRequestException } from "@estore/middlewares";
import { redis } from "@estore/db-utils";
import { sendEmail } from "./mail.helper";

export async function checkOtpRestrictions(email: string) {
  if (await redis.get(`otp_lock:${email}`))
    throw new BadRequestException(
      "Account locked due to multiple failed attempts! Try again after 30 minutes",
    );

  if (await redis.get(`otp_spam_lock:${email}`))
    throw new BadRequestException(
      "Tomo many OTP requests! Please wait 1 hour before sending request again.",
    );

  if (await redis.get(`otp_cooldown:${email}`))
    throw new BadRequestException(
      "Please wait 1 minute before requesting a new OTP!",
    );
}

export async function trackOtpRequests(email: string) {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    throw new BadRequestException(
      "Too many OTP requests! Please wait 1 hour before sending request again.",
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
}

export async function sendOtp(name: string, email: string, template: string) {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
}

export async function verifyOtp(email: string, otp: string) {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) throw new BadRequestException("Invalid OTP or Expired!");
  const attemptsKey = `otp_attempts:${email}`;
  const attempts = parseInt((await redis.get(attemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (attempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, attemptsKey);
      throw new BadRequestException(
        "Too many failed attempts. Your account is locked for 30 minutes!",
      );
    }
    await redis.set(attemptsKey, attempts + 1);
    throw new BadRequestException(
      `Incorrect OTP. ${2 - attempts} attempts left.`,
    );
  }

  await redis.del(`otp:${email}`, attemptsKey);
}

export async function deleteOtp(email: string) {
  await redis.del(`otp:${email}`);
}
