import { verifyKeyMiddleware } from "discord-interactions";
import { Router } from "express";
import { config } from "../config/configuration";
import { setDiscordLocale } from "../common/middlewares/getDiscordLocale";
import { InteractionsController } from "../controllers/interaction-handler";
import { DiscordUnexpectedError } from "../errors/discord/discordUnexpectedErro";

export function createDiscordRoutes() {
  const controller = new InteractionsController();
  const router = Router();

  router.post(
    "/interactions",
    verifyKeyMiddleware(config.discord.publicKey),
    setDiscordLocale,
    async (req, res, next) => {
      try {
        await controller.handleInteractions(req, res);
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}
