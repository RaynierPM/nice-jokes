import { NextFunction, Request, Response } from "express";

export function unexpectedErrorHandler(
  err: unknown,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) {
  console.log(err);
  res.status(500).json({ error: err, message: res.__("bot.unexpected_error") });
}
