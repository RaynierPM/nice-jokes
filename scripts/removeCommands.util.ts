import { AxiosError } from "axios";
import { config } from "../src/config/configuration";
import { discordApi } from "../src/discord/commons/discordAPI";

async function removeCommands() {
  console.log("Removing commands...");
  try {
    const commands = await discordApi<{ id: number }[]>(
      `/applications/${config.discord.appId}/commands`,
      { method: "GET" },
    );
    let i = 0;

    for (const cmd of commands.data) {
      console.log("Remaining commands: " + (commands.data?.length - i));
      await discordApi(
        `/applications/${config.discord.appId}/commands/${cmd.id}`,
        { method: "DELETE" },
      );
      i++;
    }

    console.log("Commands removed sucessfully");
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(e.response?.data);
    }
    console.log("Something went wrong while deleting commands");
  }
}

removeCommands();
