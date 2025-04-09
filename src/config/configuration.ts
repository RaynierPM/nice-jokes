import { getOrThrow } from "../common/env/getOrTrhow";

type Configuration = {
  app: {
    env: string;
    port: number;
  };
  discord: {
    appId: string;
    publicKey: string;
    botKey: string;
  };
};

export const config: Configuration = {
  app: {
    env: process.env.ENV || "local",
    port: Number(process.env.PORT) || 3000,
  },
  discord: {
    appId: getOrThrow(process.env, "APP_ID"),
    publicKey: getOrThrow(process.env, "PUBLIC_KEY"),
    botKey: getOrThrow(process.env, "BOT_KEY"),
  },
};
