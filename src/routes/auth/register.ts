import { Role } from "@prisma/client";
import { RequestHandler, Router } from "express";
import { cache, database } from "src/context";
import { encodePassword } from "src/utils/encrypt-utils";
import { CacheKeys } from "src/utils/cache-utils";
import { randomNumberOfNDigits } from "src/utils/compute-utils";
import Logger from "src/utils/logger";

const handler: RequestHandler = async (req, res) => {
  let email: string = req.body.email?.trim();
  let firstName: string = req.body.firstName?.trim();
  let lastName: string = req.body.lastName?.trim();
  let phoneNumber: string = req.body.phoneNumber?.trim();
  let password: string = req.body.password?.trim();
  let role: Role = req.body.role?.trim()?.toUpperCase();

  if (!password || !email || !firstName || !lastName) {
    return res.status(400).json({ message: "Provide all neccessary fields" });
  }

  if (!role || !(role in Role)) {
    return res.status(400).json({ message: "Please provide a valid role" });
  }

  const account = await database.account.findUnique({ where: { email } });
  if (account) return res.status(400).json({ message: "Email already in use" });

  password = encodePassword(password);
  email = email.toLocaleLowerCase();

  const newAccount = await database.account.create({
    data: {
      firstName,
      lastName,
      password,
      phoneNumber,
      email,
      roles: [role],
    },
  });
  Logger.log(newAccount);

  const verificationCode = randomNumberOfNDigits(6);
  await Promise.all([cache.store(CacheKeys.verifyEmailOTP(email), verificationCode, 600)]);
  // TODO: SEND OTP CODE TO EMAIL

  return res.status(200).json({
    message: `Successfully register an account with email: ${email}`,
    action: "verify-email",
  });
};

export default (router: Router) => router.post("/register", handler);
