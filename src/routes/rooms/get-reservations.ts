import { Router } from "express";
import { database } from "src/context";
import { authMiddleware } from "src/middlewares";
import { AuthRequestHandler } from "src/middlewares/auth-middleware";

const handler: AuthRequestHandler = async (req, res) => {
  let id = req.params.id?.trim();

  if (!id) return res.status(400).json({ message: "Room ad id not provided" });

  const roomAd = await database.roomAd.findUnique({ where: { id } });
  if (!roomAd) return res.status(400).json({ message: "RoomAd not found" });

  const reservations = database.reservation.findMany({ where: { roomAdId: id }, include: { reservee: true } });

  return res.status(200).json({ data: { reservations } });
};

export default (router: Router) => router.post("/get-reservations/:id", authMiddleware(["HOST"]), handler);
