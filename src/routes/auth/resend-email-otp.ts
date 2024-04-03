import { RequestHandler, Router } from "express";
import { cache, database } from "src/context";
import { CacheKeys } from "src/utils/cache-utils";
import { randomNumberOfNDigits } from "src/utils/compute-utils";

const handler: RequestHandler = async (req, res) => {
  let email = req.body.email?.trim();

  if (!email) return res.status(400).json({ message: "Required email!!" });

  let account = await database.account.findUnique({ where: { email } });

  if (!account) return res.status(400).json({ message: "Account with the given email not found!!" });

  const cacheKey = CacheKeys.verifyEmailOTP(email);

  const verificationCode = randomNumberOfNDigits(6);
  cache.store(cacheKey, verificationCode, 600);
  // TODO: SEND OTP CODE TO PHONE NUMBER

  res.status(200).json({ message: `Verificaiton code sent successfully to ${email}.` });
};

export default (router: Router) => router.post("/resend-email-otp", handler);
