import axios, { AxiosRequestConfig } from "axios";
import { config } from "../../config/configuration";

const GiphyAxios = axios.create({
  baseURL: "https://api.giphy.com",
});

GiphyAxios.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    api_key: config.giphy.apiKey,
  };
  return request;
});

export async function giphyApi<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig,
) {
  return await GiphyAxios<T>({
    url: endpoint,
    ...options,
  });
}
