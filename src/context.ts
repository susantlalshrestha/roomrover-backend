import { PrismaClient } from "@prisma/client";
import { RedisClient } from "./utils/cache-utils";


export const database = new PrismaClient();
export const cache = RedisClient.createInstance();
