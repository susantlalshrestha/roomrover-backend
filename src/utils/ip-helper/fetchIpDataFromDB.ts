import { database } from "src/context";
import Logger from "../logger";

export default async (ipAddress: string) => {
  try {
    Logger.log("[STARTED]: Fetching ip data from DB", ipAddress);
    const ipData = await database.session.findFirst({
      where: { ipAddress },
      select: {
        ipAddress: true,
        city: true,
        country: true,
        countryCode: true,
        data: true,
      },
    });
    Logger.log(`[${ipData ? `COMPLETED` : `FAILED`}]: Fetching ip data from DB`, ipData.ipAddress);
    return ipData;
  } catch (error) {
    Logger.log("[Failed]: Fetching ip data from DB", error);
  }
};
