import { InteractionType } from "discord-interactions";
import { CommandTypes } from "../commons/CommandsTypes.enum";

enum DiscordContext {
  GUILD = 0,
  BOT_DM,
  PRIVATE_CHANNEL,
}

type User = {
  id: unknown;
  username: string;
  bot?: boolean;
  locale: string;
  email: string;
};

type Message = {
  id: unknown;
  author: User;
  timestamp: Date;
  edited_timestamp?: Date;
  mention_everyone: boolean;
  type: number;
};

type InteractionData = {
  id: unknown;
  name: string;
  type: CommandTypes;
  guild_id: unknown;
};

export type DiscordInteraction = {
  id: unknown;
  type: InteractionType;
  context: DiscordContext;
  token: string;
  user: User;
  message: Message;
  locale: string;
  data: InteractionData;
};
