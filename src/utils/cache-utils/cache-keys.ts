export default {
  verifyPhoneOTP: (phone: string) => `verify-phone-otp:${phone}`,
  verifyEmailOTP: (email: string) => `verify-email-otp:${email}`,
  resetPasswordOTP: (email: string) => `reset-password-otp:${email}`,
};
