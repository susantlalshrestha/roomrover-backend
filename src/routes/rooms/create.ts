import { Router } from "express";
import { database } from "src/context";
import { authMiddleware } from "src/middlewares";
import { AuthRequestHandler } from "src/middlewares/auth-middleware";

const handler: AuthRequestHandler = async (req, res) => {
  let title = req.body.title?.trim();
  let description = req.body.title?.trim();
  let price = req.body.price?.trim();

  const isValid = title & description & price;
  if (!isValid) return res.status(400).json({ message: "Provide all neccessary fields!!" });

  if (isNaN(parseFloat(price))) return res.status(400).json({ message: "Invalid price provided!!" });
  price = parseFloat(price);

  const roomAd = await database.roomAd.create({
    data: {
      description,
      price,
      title,
      publishedBy: { connect: { id: req.user.id } },
    },
  });

  return res.status(200).json({ data: { roomAd } });
};

export default (router: Router) => router.post("/create", authMiddleware(["HOST"]), handler);
