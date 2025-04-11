import axios, { AxiosRequestConfig } from "axios";

const jokesAxios = axios.create({
  baseURL: "https://official-joke-api.appspot.com",
});

export async function jokeApi<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig,
) {
  return await jokesAxios<T>({
    url: endpoint,
    ...options,
  });
}
