import { Express } from "express";
import { pingRouter } from "./ping.route";
import { createDiscordRoutes } from "./interactions.route";

export function scaffoldRoutes(app: Express): void {
  app.use(pingRouter);
  app.use(createDiscordRoutes());
}
