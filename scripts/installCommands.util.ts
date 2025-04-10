import { config } from "../src/config/configuration";
import { commands } from "../src/discord/commands/commands";
import { discordApi } from "../src/discord/commons/discordAPI";

async function installCommands() {
  console.log("Installing bot commands...");
  console.log(commands);
  return await discordApi(`/applications/${config.discord.appId}/commands`, {
    method: "PUT",
    data: commands,
  });
}

installCommands()
  .then(() => console.log("Commands installed"))
  .catch((e) => {
    console.log(e.response.data);
    console.log("Error adding commands");
  });
