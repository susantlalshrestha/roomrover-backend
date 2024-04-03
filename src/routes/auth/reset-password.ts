import { RequestHandler, Router } from "express";
import { isEmpty } from "lodash";
import { cache, database } from "src/context";
import { encodePassword } from "src/utils/encrypt-utils";
import { CacheKeys } from "src/utils/cache-utils";

const handler: RequestHandler = async (req, res) => {
  let otp = req.body.otp?.trim();
  let phoneNumber = req.body.phoneNumber?.trim();
  let newPassword = req.body.newPassword?.trim();

  if (isEmpty(phoneNumber)) return res.status(400).json({ message: "Required phone number!!" });
  if (isEmpty(newPassword)) return res.status(400).json({ message: "Required new password!!" });
  if (isEmpty(otp)) return res.status(400).json({ message: "Required new password!!" });

  const cacheCode = await cache.fetch(CacheKeys.resetPasswordOTP(phoneNumber));
  if (!cacheCode) return res.status(400).json({ message: "Reset password code expired!!" });
  if (cacheCode !== otp) return res.status(400).json({ message: "Reset password code did not matched!!" });

  const account = await database.account.update({
    where: { phoneNumber },
    data: { password: encodePassword(newPassword) },
  });
  if (!account) return res.status(400).json({ message: "Account with the given phone number not found!!" });

  cache.delete(CacheKeys.resetPasswordOTP(phoneNumber));

  return res.status(400).json({
    message: "Your password has been changed successfully. You can use your new password to login.",
  });
};

export default (router: Router) => router.post("/resend-phone-otp", handler);
