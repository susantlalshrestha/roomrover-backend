import { Router } from "express";
import login from "./login";
import verifyPhone from "./verify-phone";
import resendEmailOtp from "./resend-email-otp";
import resendPhoneOtp from "./resend-phone-otp";
import verifyEmail from "./verify-email";
import resetPassword from "./reset-password";
import forgotPassword from "./forgot-password";
import register from "./register";

const auth = Router();

forgotPassword(auth);
login(auth);
register(auth);
resendEmailOtp(auth);
resendPhoneOtp(auth);
resetPassword(auth);
verifyEmail(auth);
verifyPhone(auth);

export default auth;
