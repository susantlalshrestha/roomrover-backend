import { RequestHandler, Router } from "express";
import { cache, database } from "src/context";
import { CacheKeys } from "src/utils/cache-utils";

const handler: RequestHandler = async (req, res) => {
  let otp = req.body.otp?.trim();
  let email = req.body.email?.trim();

  if (!otp || !email) return res.status(400).json({ message: "Provide all neccessary fields" });

  otp = parseInt(otp);

  const cacheCode = await cache.fetch(CacheKeys.verifyEmailOTP(email));
  if (!cacheCode) return res.status(400).json({ message: "Verificaiton code expired!!" });
  if (cacheCode !== otp) return res.status(400).json({ message: "Verificaiton code did not matched!!" });

  const account = await database.account.update({ where: { email }, data: { emailVerified: true } });
  if (!account) return res.status(400).json({ message: "Account with the given email not found!!" });

  cache.delete(CacheKeys.verifyEmailOTP(email));

  return res.status(200).json({ message: "Your email has been verified" });
};

export default (router: Router) => router.post("/verify-email", handler);
