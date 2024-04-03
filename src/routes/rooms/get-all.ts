import { RequestHandler, Router } from "express";
import { database } from "src/context";

const handler: RequestHandler = async (req, res) => {
  let take = req.body.take?.trim() ?? 10;
  let skip = req.body.skip?.trim() ?? 0;

  if (isNaN(parseFloat(take))) take = 10;
  if (isNaN(parseFloat(skip))) skip = 0;

  const roomAds = database.roomAd.findMany({
    include: {
      _count: true,
      address: true,
      publishedBy: true,
    },
    skip,
    take,
  });

  return res.status(200).json({ data: { roomAds } });
};

export default (router: Router) => router.post("/get-all", handler);
