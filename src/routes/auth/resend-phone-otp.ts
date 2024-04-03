import { RequestHandler, Router } from "express";
import { cache, database } from "src/context";
import { CacheKeys } from "src/utils/cache-utils";
import { randomNumberOfNDigits } from "src/utils/compute-utils";

const handler: RequestHandler = async (req, res) => {
  let phoneNumber = req.body.phoneNumber?.trim();

  if (!phoneNumber) return res.status(400).json({ message: "Required phone number!!" });

  let account = await database.account.findUnique({ where: { phoneNumber } });

  if (!account) return res.status(400).json({ message: "Account with the given phone number not found!!" });

  const cacheKey = CacheKeys.verifyPhoneOTP(phoneNumber);

  const verificationCode = randomNumberOfNDigits(6);
  cache.store(cacheKey, verificationCode, 600);
  // TODO: SEND OTP CODE TO PHONE NUMBER

  res.status(200).json({ message: `Verificaiton code sent successfully to ${phoneNumber}.` });
};

export default (router: Router) => router.post("/resend-phone-otp", handler);
