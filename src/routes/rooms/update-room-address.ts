import { Router } from "express";
import { database } from "src/context";
import { authMiddleware } from "src/middlewares";
import { AuthRequestHandler } from "src/middlewares/auth-middleware";

const handler: AuthRequestHandler = async (req, res) => {
  let id = req.params.id?.trim();
  if (!id) return res.status(400).json({ message: "Room ad id not provided" });

  let roomAd = await database.roomAd.findUnique({ where: { id }, include: { address: true } });
  if (!roomAd) return res.status(400).json({ message: "RoomAd not found" });
  if (roomAd.publisherId != req.user.id) {
    return res.status(401).json({ message: "Your are not authorized to perform this action!!" });
  }

  let aptUnit = req.body.aptUnit?.trim();
  let street = req.body.street?.trim();
  let city = req.body.city?.trim();
  let postalCode = req.body.postalCode?.trim();
  let country = req.body.country?.trim();
  let latitude = req.body.latitude?.trim();
  let longitude = req.body.longitude?.trim();

  if (!roomAd.address.id) {
    const isValid = street & city & postalCode & country;
    if (!isValid) return res.status(400).json({ message: "Provide all neccessary fields!!" });
  }

  roomAd = await database.roomAd.update({
    where: { id },
    data: {
      address: {
        upsert: {
          create: { city, country, postalCode, street, aptUnit, latitude, longitude },
          update: { city, country, postalCode, street, aptUnit, latitude, longitude },
        },
      },
    },
    include: { address: true },
  });

  return res.status(200).json({ message: "Your room address is updated" });
};

export default (router: Router) => router.post("/update-room-address/:id", authMiddleware(["HOST"]), handler);
