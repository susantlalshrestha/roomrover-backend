import { RequestHandler, Router } from "express";
import { cache, database } from "src/context";
import { CacheKeys } from "src/utils/cache-utils";

const handler: RequestHandler = async (req, res) => {
  let otp = req.body.otp?.trim();
  let phoneNumber = req.body.phoneNumber?.trim();

  if (!otp || !phoneNumber) return res.status(400).json({ message: "Provide all neccessary fields" });

  otp = parseInt(otp);

  const cacheCode = await cache.fetch(CacheKeys.verifyPhoneOTP(phoneNumber));
  if (!cacheCode) return res.status(400).json({ message: "Verificaiton code expired!!" });
  if (cacheCode !== otp) return res.status(400).json({ message: "Verificaiton code did not matched!!" });

  const account = await database.account.update({ where: { phoneNumber }, data: { phoneVerified: true } });
  if (!account) return res.status(400).json({ message: "Account with the given phone number not found!!" });

  cache.delete(CacheKeys.verifyPhoneOTP(phoneNumber));

  return res.status(200).json({ message: "Your account has been verified" });
};

export default (router: Router) => router.post("/verify-phone", handler);
