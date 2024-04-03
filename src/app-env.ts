import { config } from "dotenv";
config();

module AppEnv {
  export const appName = "roomrover-api";
  export const serverPort = "4000";
  export const databaseUrl = process.env.DATABASE_URL;
  export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  export const ipStackKey = process.env.IP_STACK_KEY;
  export const twilioSID = process.env.TWILIO_SID;
  export const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  export const redisHost = process.env.REDIS_HOST;
  export const redisPort = process.env.REDIS_PORT;
  export const redisPassword = process.env.REDIS_PASSWORD;
}

export default AppEnv;
