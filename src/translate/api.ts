import axios, { AxiosRequestConfig } from "axios";

const translationAxios = axios.create({
  baseURL: "https://libretranslate.com",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function translationApi(
  endpoint: string,
  options: AxiosRequestConfig,
) {
  return translationAxios({
    url: endpoint,
    ...options,
  });
}
