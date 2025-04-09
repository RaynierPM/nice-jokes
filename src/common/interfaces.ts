import { type Request, type Response, type NextFunction } from "express";

export type Controller<T> = {
  [K in keyof T]: T[K] extends CallableFunction
    ? (
        req: Request,
        res: Response,
        next: NextFunction,
      ) => unknown | Promise<unknown>
    : T[K];
};
