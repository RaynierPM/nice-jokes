import { InteractionType } from "discord-interactions";
import { availableComands } from "./availableCommands.enum";
import { config } from "../../config/configuration";
import { CommandTypes } from "../commons/CommandsTypes.enum";

export const commands = [
  {
    name: availableComands.WAKE_UP,
    type: CommandTypes.CHAT_INPUT,
    description: "It's time to wake up little baby!",
  },
  {
    name: availableComands.JOKE,
    type: CommandTypes.CHAT_INPUT,
    description: "Always it's good moment for a joke",
  },
];

if (config.app.env.toLocaleLowerCase() !== "prod") {
  commands.push({
    name: availableComands.PING,
    type: CommandTypes.CHAT_INPUT,
    description: "Is this bot alive or working?!",
  });
}
