import { isEnglishLocale } from "../common/utils/isEnglishLocal";
import { config } from "../config/configuration";
import { getTranslatedText } from "../translate";
import { jokeApi } from "./api";

export async function getRandomJoke(lang: string = "en") {
  let { data: joke } = await jokeApi<Joke>("/random_joke", {
    method: "GET",
  });

  joke = await translateJoke(joke, lang);

  return joke;
}

export async function translateJoke(joke: Joke, lang: string): Promise<Joke> {
  if (config.translations.isAvailable || isEnglishLocale(lang)) {
    return joke;
  }
  console.log();
  joke.setup = await getTranslatedText({ text: joke.setup, lang });
  joke.punchline = await getTranslatedText({ text: joke.punchline, lang });

  return joke;
}
