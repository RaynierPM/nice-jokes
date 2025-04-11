import { NextFunction, Request, Response } from "express";
import { BotResponses } from "../responses/defaults";
import { DiscordUnexpectedError } from "../../errors/discord/discordUnexpectedErro";

export function handleDiscordError(
  _: Request,
  res: Response,
  __: NextFunction,
  error: unknown,
) {
  if (error instanceof DiscordUnexpectedError) {
    return BotResponses.unexpectedErrorMsg(res);
  }
}
