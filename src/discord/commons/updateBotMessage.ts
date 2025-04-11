import { config } from "../../config/configuration";
import { discordApi } from "./discordAPI";

export function updateBotMessage(
  {
    messageId,
    token,
  }: {
    token: string;
    messageId: string;
  },
  newMessage: unknown,
) {
  return discordApi(
    `/webhooks/${config.discord.appId}/${token}/messages/${messageId}`,
    {
      method: "PATCH",
      data: newMessage,
    },
  );
}
