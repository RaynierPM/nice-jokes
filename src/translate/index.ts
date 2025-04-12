import { translationApi } from "./api";

type TranlsationOptions = {
  source?: string;
  lang: string;
  text: string;
};

export async function getTranslatedText({
  text,
  lang,
  source,
}: TranlsationOptions) {
  if (!lang) {
    throw new Error("Language to traslate needed");
  }

  const { data: translation } = await translationApi("/translate", {
    method: "POST",
    data: {
      source: source || "en",
      target: lang,
      format: "text",
      alternatives: 0,
      q: text,
    },
  });
  console.log(translation);
  return translation.translatedText;
}
