import { giphyApi } from "./api";

export async function translateGiphy(text: string) {
  const gifResponse = await giphyApi<{ data: GifData; meta: unknown }>(
    "v1/gifs/translate",
    {
      params: {
        s: text,
      },
    },
  );
  return gifResponse.data?.data;
}

export async function randomGif(tags: string) {
  const gifResponse = await giphyApi<{ data: GifData; meta: unknown }>(
    "v1/gifs/random",
    {
      params: {
        tag: tags,
      },
    },
  );
  return gifResponse.data?.data;
}
