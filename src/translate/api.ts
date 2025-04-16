import axios, { AxiosRequestConfig } from "axios";
import { config } from "../config/configuration";

const translationAxios = axios.create({
  baseURL: config.translations.translationAPIURL,
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
