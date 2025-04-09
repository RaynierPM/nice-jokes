import { verifyKeyMiddleware } from "discord-interactions";
import { Router } from "express";
import { config } from "../config/configuration";

export const DiscordRoutes = Router();

DiscordRoutes.post(
  "/interactions",
  verifyKeyMiddleware(config.discord.publicKey),
);
