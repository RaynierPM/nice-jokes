import { NextFunction, Request, Response } from "express";
import { BotResponses } from "../responses/bot/defaults";
import { DiscordUnexpectedError } from "../../errors/discord/discordUnexpectedError";

export function handleDiscordError(
  error: unknown,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof DiscordUnexpectedError) {
    console.log({ error });
    return BotResponses.unexpectedErrorMsg(res);
  }
  next();
}
