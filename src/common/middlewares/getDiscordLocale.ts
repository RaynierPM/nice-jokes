import { NextFunction, Request, Response } from "express";

export function setDiscordLocale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { locale } = req.body;

  console.log({ locale });

  if (locale) {
    res.setLocale(locale);
  }

  next();
}
