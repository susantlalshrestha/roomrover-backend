import { RequestHandler, Router } from "express";
import { database } from "src/context";

const handler: RequestHandler = async (req, res) => {
  let id = req.params.id?.trim();

  if (!id) return res.status(400).json({ message: "Room ad id not provided" });

  const roomAd = await database.roomAd.findUnique({ where: { id } });
  if (!roomAd) return res.status(400).json({ message: "RoomAd not found" });

  const reviews = database.reviews.findMany({ where: { roomAdId: id }, include: { reviewer: true } });

  return res.status(200).json({ data: { reviews } });
};

export default (router: Router) => router.post("/get-reviews/:id", handler);
