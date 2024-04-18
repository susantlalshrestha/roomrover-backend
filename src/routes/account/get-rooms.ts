import { Router } from "express";
import { database } from "src/context";
import authMiddleware, { AuthRequestHandler } from "src/middlewares/auth-middleware";

const handler: AuthRequestHandler = async (req, res) => {
  let id = req.user?.id;
  if (!id) {
    return res.status(401).json({ message: "Your are not authorized to perform this action!!" });
  }
  let account = await database.account.findUnique({ where: { id } });
  if (account.suspended) {
    return res.status(403).json({ message: "Your account has been suspended. Please contact support team!!" });
  }

  const roomAds = await database.roomAd.findMany({ where: { publisherId: id, deleted: false } });

  return res.status(200).json({ data: { roomAds } });
};

export default (router: Router) => router.post("/get-rooms", authMiddleware(["HOST"]), handler);
