import z from "zod";

export const registerSchema = z.object({
  name: z.string().nonempty("Name is required").trim().min(1).max(255),
  email: z
    .email("Invalid email address")
    .nonempty("Email is required")
    .trim()
    .max(255),
  password: z.string().nonempty("Password is required").trim().min(6).max(255),
});

export const verifySchema = z.object({
  otp: z.string().nonempty("OTP is required").min(4).max(4),
});
