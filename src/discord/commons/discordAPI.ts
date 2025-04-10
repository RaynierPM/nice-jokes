import axios, { Method } from "axios";
import { config } from "../../config/configuration";
const discord = axios.create({
  baseURL: "https://discord.com/api/v10",
});

type DiscordApiOptions<T = unknown> = {
  method: Method;
  data?: T;
};

export async function discordApi<T = unknown>(
  endpoint: string,
  options: DiscordApiOptions,
) {
  if (!options.method) options.method = "GET";

  return await discord<T>({
    url: endpoint,
    headers: {
      Authorization: `Bot ${config.discord.botKey}`,
      "Content-Type": "application/json",
      "User-Agent":
        "DiscordBot (https://github.com/RaynierPM/nice-jokes, 1.0.0)",
    },

    ...options,
  });
}
