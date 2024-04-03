import DataLoader from "dataloader";
import Redis, { RedisOptions } from "ioredis";
import AppEnv from "src/app-env";

const { appName, redisHost, redisPort, redisPassword } = AppEnv;

const host = redisHost !== "[object Object]" ? redisHost : "localhost";
const port = parseInt(redisPort) || 6379;
const password = redisPassword;

const redisOptions: RedisOptions = {
  host,
  port,
  password,
  connectTimeout: 5000,
  reconnectOnError: function (err) {
    var targetError = "READONLY";
    if (err.message.slice(0, targetError.length) === targetError) {
      // Only reconnect when the error starts with "READONLY"
      return true;
    }
  },
  retryStrategy: function (times) {
    if (times >= 3) return;
    var delay = Math.min(times * 50, 2000);
    return delay;
  },
};

export default class RedisClient extends Redis {
  private readonly cachePrefix = appName;

  private loader: DataLoader<string, string | null>;

  private constructor(options: RedisOptions) {
    super(options);
  }

  private initialize() {
    this.loader = new DataLoader((keys) => this.mget(...keys), {
      cache: false,
    });
  }

  static createInstance(): RedisClient {
    const redisClient = new RedisClient(redisOptions);
    redisClient.initialize();
    return redisClient;
  }

  async delete(key: number | string) {
    try {
      const result = await this.del(`${this.cachePrefix}:${key}`);
      return result > 0;
    } catch (error) {
      return false;
    }
  }

  async deleteMany(pattern: string) {
    const stream = this.scanStream({ match: `${this.cachePrefix}:${pattern}` });
    stream.on("data", (keys) => {
      if (!keys?.length) return;
      const pipeline = this.pipeline();
      keys.forEach((key) => pipeline.del(key));
      pipeline.exec();
    });
  }

  async fetch<D = any>(key: number | string): Promise<D | null | undefined> {
    try {
      const cacheKey = `${this.cachePrefix}:${key}`;
      const cacheDoc = await this.loader.load(cacheKey);
      if (cacheDoc) return JSON.parse(cacheDoc);
    } catch (error) {
      return null;
    }
  }

  async listKeys(pattern: string = "*") {
    try {
      return await this.keys(`${this.cachePrefix}:${pattern}`);
    } catch (error) {
      return null;
    }
  }

  async store<D = any>(key: number | string, data: D, ttl: number = 300) {
    try {
      const cacheKey = `${this.cachePrefix}:${key}`;
      if (Number.isInteger(ttl)) {
        await this.set(cacheKey, JSON.stringify(data), "EX", ttl);
      }
    } catch (error) {
      return;
    }
  }
}
