import z, { email } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(1).max(255),
  email: z.email(),
  password: z.string().min(8).max(255),
});

const verifyOTPRequestSchema = z.object({
  sessionId: z.uuid(),
  otp: z.string(),
});

const resendOTPRequestSchema = z.object({
  sessionId: z.uuid(),
});

const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(255),
});

export type RegisterRequestDTO = z.infer<typeof registerSchema>;
export type VerifyOTPRequestDTO = z.infer<typeof verifyOTPRequestSchema>;
export type ResendOTPRequestDTO = z.infer<typeof resendOTPRequestSchema>;
