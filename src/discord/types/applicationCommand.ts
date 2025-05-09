import { InteractionType, MessageComponentTypes } from "discord-interactions";
import { CommandTypes } from "../commons/CommandsTypes.enum";

export enum DiscordContext {
  GUILD = 0,
  BOT_DM,
  PRIVATE_CHANNEL,
}

type User = {
  id: unknown;
  username: string;
  bot?: boolean;
  locale?: string;
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

type InteractionAppCommandData = {
  id: unknown;
  name: string;
  type: CommandTypes;
  guild_id: unknown;
};

type InteractionMessageData = {
  custom_id: string;
  component_type: MessageComponentTypes;
  values: unknown[];
};

type Role = {
  id: unknown;
  name: string;
  color: number;
};

type GuildMember = {
  user: User;
  deat: boolean;
  mute: boolean;
  nick?: string;
  roles: Role[];
};

type DiscordInteractionBase = {
  id: unknown;
  context: DiscordContext;
  token: string;
  member: GuildMember;
  user?: User;
  locale?: string;
  guild_id?: unknown;
};

export type DiscordInteractionMessage = DiscordInteractionBase & {
  type: Exclude<
    Exclude<InteractionType, InteractionType.APPLICATION_COMMAND>,
    InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE
  >;
  message: Message;
  data: InteractionMessageData;
};

export type DiscordInteractionCommand = DiscordInteractionBase & {
  type:
    | InteractionType.APPLICATION_COMMAND
    | InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE;
  message: undefined;
  data: InteractionAppCommandData;
};

export type DiscordInteraction =
  | DiscordInteractionMessage
  | DiscordInteractionCommand;

export type GalleryItem = {
  media: { url: string; width?: string; height?: string };
  description?: string;
};
