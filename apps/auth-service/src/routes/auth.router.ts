import express, { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resendOtp,
  resetPassword,
  verify,
  verifyForgotPasswordOTP,
} from "../controllers/auth.controller";
import { validate } from "@estore/middlewares";
import { registerSchema, verifySchema } from "@estore/schemas";

const router: Router = express.Router();

router.post("/register", validate({ body: registerSchema }), register);
router.post("/verify", validate({ body: verifySchema }), verify);
router.get("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOTP);
router.post("/reset-password", resetPassword);

export default router;
