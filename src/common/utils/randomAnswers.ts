import { config } from "../../config/configuration";

export abstract class RandomAnswers {
  static GET_RANDOM_PING_KEY() {
    return this.getRandomKey("bot.PING.#", config.bot.available_pings);
  }

  static GET_RANDOM_WOKE_UP_KEY() {
    return this.getRandomKey("bot.hello.#", config.bot.available_salutations);
  }

  static GET_RANDOM_IDK_KEY() {
    return this.getRandomKey("bot.idk.#", config.bot.available_idks);
  }

  private static getRandomIndex(length: number) {
    return Math.floor(Math.random() * (length - 1));
  }

  /**
   *
   * @param key - Expression used to key with number - ex: bot.# (# replaced by the randomIndex)
   * @param length - Options's lenght
   * @returns string key
   */
  private static getRandomKey(key: string, length: number) {
    return key.replace("#", this.getRandomIndex(length).toString());
  }
}
