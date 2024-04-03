import { Router } from "express";
import { database } from "src/context";
import { authMiddleware } from "src/middlewares";
import { AuthRequestHandler } from "src/middlewares/auth-middleware";

const handler: AuthRequestHandler = async (req, res) => {
  let id = req.params.id?.trim();

  if (!id) return res.status(400).json({ message: "Room ad id not provided" });

  const roomAd = await database.roomAd.findUnique({ where: { id } });
  if (!roomAd) return res.status(400).json({ message: "RoomAd not found" });

  if (roomAd.publisherId != req.user.id)
    return res.status(401).json({ message: "Your are not authorized to perform this action!!" });

  const updated = database.roomAd.update({ where: { id }, data: { deleted: true } });

  return res.status(200).json({ message: "Your room add is removed" });
};

export default (router: Router) => router.post("/remove/:id", authMiddleware(["HOST"]), handler);
