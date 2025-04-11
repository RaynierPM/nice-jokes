import { getOrThrow } from "../common/env/getOrTrhow";
import dotenv from "dotenv";
import en from "../../locales/en.json";
import { getKeyLengths } from "../common/utils/keyLengths";

dotenv.config({
  path: `./${process.env.ENVFILE}`,
});

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
  bot: {
    available_salutations: number;
    available_pings: number;
    available_idks: number;
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
  bot: {
    available_salutations: getKeyLengths(en, "bot.hello.*"),
    available_pings: getKeyLengths(en, "bot.PING.*"),
    available_idks: getKeyLengths(en, "bot.idk.*"),
  },
};
