import { RequestHandler, Router } from "express";
import { database } from "src/context";

const handler: RequestHandler = async (req, res) => {
  let search = req.body.search?.trim();
  let minPrice = req.body.minPrice?.trim();
  let maxPrice = req.body.maxPrice?.trim();
  let take = req.body.take?.trim();
  let skip = req.body.skip?.trim();

  if (minPrice) minPrice = parseFloat(minPrice);
  if (maxPrice) maxPrice = parseFloat(maxPrice);
  if (minPrice) take = parseFloat(take);
  if (skip) minPrice = parseFloat(skip);

  if (isNaN(parseFloat(take))) take = 10;
  if (isNaN(parseFloat(skip))) skip = 0;
  if (isNaN(parseFloat(minPrice))) minPrice = 0;
  if (isNaN(parseFloat(maxPrice))) maxPrice = 10000;

  const roomAds = await database.roomAd.findMany({
    where: {
      AND: [
        {
          AND: [
            { price: maxPrice ? { lte: maxPrice } : undefined },
            { price: minPrice ? { gte: minPrice } : undefined },
          ],
        },
        { title: search ? { contains: search } : undefined },
      ],
    },
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
