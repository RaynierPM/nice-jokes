import { config } from "../../config/configuration";
import { discordApi } from "./discordAPI";

export function removeBotMsg(token: string, messageId: unknown) {
  return discordApi(
    `/webhooks/${config.discord.appId}/${token}/messages/${messageId}`,
    {
      method: "DELETE",
    },
  );
}
