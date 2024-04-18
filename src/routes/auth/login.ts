import { RequestHandler, Router } from "express";
import { omit } from "lodash";
import { database } from "src/context";
import { matchPassword } from "src/utils/encrypt-utils";
import { getIpData } from "src/utils/ip-helper";
import { encodeToken } from "src/utils/token-helper";

const handler: RequestHandler = async (req, res) => {
  let email = req.body.email?.trim();
  let password = req.body.password?.trim();

  const isValid = password && email;

  if (!isValid) return res.status(400).json({ message: "Provide all neccessary fields!!" });

  const account = await database.account.findUnique({ where: { email } });
  if (!account) return res.status(400).json({ message: "Email not in use!!" });

  const passwordMatched = matchPassword(password, account.password);
  if (!passwordMatched) return res.status(400).json({ message: "Incorrect phone number or password!!" });

  if (account.suspended) {
    return res.status(403).json({ message: "Your account has been suspended. Please contact support team!!" });
  }

  if (!account.emailVerified) {
    return res
      .status(401)
      .json({ message: "Your account has not been verified. Please verify your account!!", action: "verify-account" });
  }

  // const ipAddress = req.headers.host;
  // const userAgent = req.headers["user-agent"];

  // const ipData = await getIpData(ipAddress);
  // const session = await database.session.upsert({
  //   create: {
  //     userAgent,
  //     ipAddress,
  //     data: ipData,
  //     account: { connect: { id: account.id } },
  //   },
  //   update: {
  //     userAgent,
  //     ipAddress,
  //     data: ipData,
  //     account: { connect: { id: account.id } },
  //   },
  //   where: { ipAddress },
  // });

  const loggedAccount = omit(account, ["password", "chatsId"]);
  const authToken = {
    access: encodeToken(loggedAccount, "access", { jwtid: account.id }),
    refresh: encodeToken({ accountId: account.id }, "refresh", { jwtid: account.id }),
  };

  return res.status(200).json({ data: { account: loggedAccount, token: authToken } });
};

export default (router: Router) => router.post("/login", handler);
