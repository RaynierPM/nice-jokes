import { RedisClientType, SetOptions } from "@redis/client";
import { createClient } from "redis";
import { config } from "../config/configuration";
import { TimeParser } from "../common/utils/time/timeParser";

export class RedisClient implements RedisClientInterface {
  private client: RedisClientType;

  constructor(connString: string) {
    this.client = createClient({
      url: connString,
    });
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: object | string,
    setConfig?: setConfig,
  ): Promise<void> {
    let cValue: string;
    if (typeof value === "object") {
      cValue = JSON.stringify(value);
    } else {
      cValue = value;
    }

    await this.client.set(key, cValue, this.mapSetConfig(setConfig));
  }

  async del(key: string): Promise<boolean> {
    return Boolean(await this.client.del(key));
  }

  async init(): Promise<void> {
    this.client
      .on("error", (err) => {
        console.log("Error connecting with redis", err);
      })
      .connect()
      .then((e) => {
        console.log("Redis instance connected!");
      });
  }

  private mapSetConfig(setConfig?: setConfig): SetOptions | undefined {
    if (setConfig) {
      return {
        expiration: this.mapExpiration(setConfig.TTL),
      };
    }

    return undefined;
  }

  private mapExpiration(ttl?: number): SetOptions["expiration"] | undefined {
    if (!ttl || ttl >= 0) {
      return {
        type: "EX",
        value: TimeParser.fromMinToSeg(ttl || config.redis.ttl),
      };
    } else {
      return undefined;
    }
  }
}
