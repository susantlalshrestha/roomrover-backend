import AppEnv from "src/app-env";
import Logger from "../logger";
import axios from "axios";

export default async (ipAddress: string) => {
  try {
    Logger.log("[STARTED]: Fetching ip data from IpStack", ipAddress);
    const url = `http://api.ipstack.com/${ipAddress}?access_key=${AppEnv.ipStackKey}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      const { city, country_code, country_name, ...data } = response.data;
      const ipData = {
        ipAddress,
        city,
        countryCode: country_code,
        country: country_name,
        data,
      };
      Logger.log("[COMPLETED]: Fetching ip data from IpStack", ipData.ipAddress);
      return ipData;
    }
    Logger.log("[FAILED]: Fetching ip data from IpStack", ipAddress);
    return { ipAddress };
  } catch (error) {
    Logger.log("[FAILED]: fetching ip data from IpStack", error);
    return { ipAddress };
  }
};
