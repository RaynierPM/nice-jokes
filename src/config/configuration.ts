import { getOrThrow } from "../common/env/getOrTrhow";
import dotenv from "dotenv";
import en from "../../locales/en.json";
import { getKeyLengths } from "../common/utils/keyLengths";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), process.env.ENVFILE || __dirname + "/.env"),
});

type Configuration = {
  app: {
    env: string;
    port: number;
    https: boolean;
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
  https: {
    key: string | undefined;
    fullChain: string | undefined;
  };
  translations: {
    translationAPIURL: string;
    isAvailable?: boolean;
  };
  redis: {
    host: string;
    port: number;
    ttl: number;
  };
  giphy: {
    apiKey: string;
  };
};

export const config: Configuration = {
  app: {
    env: process.env.ENV || "local",
    port: Number(process.env.PORT) || 3000,
    https: Boolean(Number(process.env.HTTPS?.[0])),
  },
  discord: {
    appId: getOrThrow("APP_ID"),
    publicKey: getOrThrow("PUBLIC_KEY"),
    botKey: getOrThrow("BOT_KEY"),
  },
  bot: {
    available_salutations: getKeyLengths(en, "bot.hello.*"),
    available_pings: getKeyLengths(en, "bot.PING.*"),
    available_idks: getKeyLengths(en, "bot.idk.*"),
  },
  https: {
    fullChain: process.env.HTTPS_FULLCHAIN_NAME,
    key: process.env.HTTPS_KEY_NAME,
  },
  translations: {
    translationAPIURL: getOrThrow("TRANSLATE_API_URL"),
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    ttl: Number(process.env.REDIS_DEFAULT_TTL) || 5,
  },
  giphy: {
    apiKey: getOrThrow("GIPHY_API_KEY"),
  },
};
