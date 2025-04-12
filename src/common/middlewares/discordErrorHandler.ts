import { NextFunction, Request, Response } from "express";
import { BotResponses } from "../responses/defaults";
import { DiscordUnexpectedError } from "../../errors/discord/discordUnexpectedErro";

export function handleDiscordError(
  error: unknown,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  if (error instanceof DiscordUnexpectedError) {
    return BotResponses.unexpectedErrorMsg(res);
  }
}
