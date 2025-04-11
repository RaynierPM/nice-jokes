import { verifyKeyMiddleware } from "discord-interactions";
import { Router } from "express";
import { config } from "../config/configuration";
import { setDiscordLocale } from "../common/middlewares/getDiscordLocale";
import { InteractionsController } from "../controllers/interaction-handler";

export function createDiscordRoutes() {
  const controller = new InteractionsController();
  const router = Router();

  router.post(
    "/interactions",
    verifyKeyMiddleware(config.discord.publicKey),
    setDiscordLocale,
    (req, res, next) => {
      controller.handleInteractions(req, res).catch(next);
    },
  );

  return router;
}
