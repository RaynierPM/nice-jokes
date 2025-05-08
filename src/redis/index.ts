import { config } from "../config/configuration";
import { RedisClient } from "./Client";

export class RedisManager {
  private static instance: RedisManager;

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager({
        host: config.redis.host,
        port: config.redis.port,
      });
    }
    return this.instance;
  }

  static init() {
    this.getInstance().redisClient.init();
  }

  private constructor(conn: RedisConnectionParams, auth?: RedisAuth) {
    const authConnString = auth ? `${auth.username}:${auth.password}@` : "";

    const connString = `redis://${authConnString}${conn.host}:${conn.port}`;

    this.redisClient = new RedisClient(connString);
  }

  redisClient: RedisClientInterface;
}
