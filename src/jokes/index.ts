import { jokeApi } from "./api";

export async function getRandomJoke() {
  return await jokeApi<Joke>("/random_joke", {
    method: "GET",
  });
}
