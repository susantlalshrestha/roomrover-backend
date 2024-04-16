import { Router } from "express";
import { database } from "src/context";
import { authMiddleware } from "src/middlewares";
import { AuthRequestHandler } from "src/middlewares/auth-middleware";

const handler: AuthRequestHandler = async (req, res) => {
  let id = req.params.id?.trim();
  if (!id) return res.status(400).json({ message: "Room ad id not provided" });

  let title = req.body.title?.trim();
  let description = req.body.title?.trim();
  let price = req.body.price?.trim();

  if (price) {
    if (isNaN(parseFloat(price))) return res.status(400).json({ message: "Invalid price provided!!" });
    price = parseFloat(price);
  }

  const roomAd = await database.roomAd.findUnique({ where: { id } });
  if (!roomAd) return res.status(400).json({ message: "RoomAd not found" });

  if (roomAd.publisherId != req.user.id)
    return res.status(401).json({ message: "Your are not authorized to perform this action!!" });

  await database.roomAd.update({ where: { id }, data: { title, description, price } });

  return res.status(200).json({ message: "Your room add is updated" });
};

export default (router: Router) => router.post("/update/:id", authMiddleware(["HOST"]), handler);
