import { RequestHandler, Router } from "express";
import { database } from "src/context";

const handler: RequestHandler = async (req, res) => {
  let id = req.params.id?.trim();

  if (!id) return res.status(400).json({ message: "Room ad id not provided" });

  const roomAd = database.roomAd.findUnique({ where: { id: id }, include: { address: true, publishedBy: true } });

  if (!roomAd) return res.status(400).json({ message: "RoomAd not found" });

  return res.status(200).json({ data: { roomAd } });
};

export default (router: Router) => router.post("/get/:id", handler);
