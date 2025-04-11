import { config } from "../../config/configuration";
import { t } from "../../i18n";

export abstract class RandomAnswers {
  static GET_RANDOM_PING_INDEX() {
    const randomIndex = Math.floor(
      Math.random() * config.bot.available_pings - 1,
    );
    return "bot.PING." + randomIndex;
  }
}
