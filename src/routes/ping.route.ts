import { Router } from "express";

export const pingRouter = Router();

pingRouter.get("/ping", (_, res) => {
  res.send(res.__("ping"));
});
