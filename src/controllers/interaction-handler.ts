import { Request, Response } from "express";
import { Controller } from "../common/interfaces";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import {
  DiscordContext,
  DiscordInteraction,
  DiscordInteractionMessage,
} from "../discord/types/applicationCommand";
import { availableComands } from "../discord/commands/availableCommands.enum";
import { RandomAnswers } from "../common/utils/randomAnswers";
import { getRandomJoke } from "../thirdParty/jokes";
import { BotResponses } from "../common/responses/bot/defaults";
import { DiscordUnexpectedError } from "../errors/discord/discordUnexpectedError";
import { updateBotMessage } from "../discord/commons/updateBotMessage";
import { RedisManager } from "../redis";
import { randomGif } from "../thirdParty/giphy";

export class InteractionsController
  implements Controller<InteractionsController>
{
  private redisClient = RedisManager.getInstance().redisClient;

  async handleInteractions(req: Request, res: Response) {
    const { type } = req.body;

    switch (type as InteractionType) {
      // case InteractionType.PING:
      //   break;
      case InteractionType.APPLICATION_COMMAND:
        return await this.handleAppCommand(req.body, res);
      case InteractionType.MESSAGE_COMPONENT:
        return await this.handleMessageComponent(req.body, res);
      default:
        return BotResponses.NotAvailableCommand(res);
    }
  }

  private async handleAppCommand(
    interaction: DiscordInteraction,
    res: Response,
  ) {
    if (interaction.type !== InteractionType.APPLICATION_COMMAND) {
      return;
    }
    const { name } = interaction.data;

    switch (name) {
      case availableComands.PING:
        res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: res.__(RandomAnswers.GET_RANDOM_PING_KEY()),
          },
        });
        break;
      case availableComands.JOKE: {
        const joke = await getRandomJoke("en");
        await this.savePendingJoke({ joke, interaction });
        BotResponses.joke(res, { interaction, joke });
        break;
      }
      case availableComands.WAKE_UP:
        await this.handleWakeUp(interaction, res);
        break;
    }
    await this.setAwakeFlag(interaction);
  }

  private async handleMessageComponent(
    interaction: DiscordInteraction,
    res: Response,
  ) {
    if (interaction.type !== InteractionType.MESSAGE_COMPONENT) {
      throw new DiscordUnexpectedError();
    }
    const { custom_id } = interaction.data;

    if (custom_id.startsWith("joke_punchline_")) {
      const jokeId = custom_id.replace("joke_punchline_", "");
      const joke = await this.getPendingJoke(jokeId);
      if (joke) {
        this.updateChatMessage(interaction, {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: joke.setup },
          components: [],
        });
        const gif = await randomGif(this.getRandomGifTag());
        BotResponses.punchLine(res, joke.punchline, gif);
      } else {
        BotResponses.alzheimer(res);
      }
    }
  }

  private async savePendingJoke({
    joke,
    interaction,
  }: {
    joke: Joke;
    interaction: DiscordInteraction;
  }) {
    await this.redisClient.set(interaction.id as string, joke);
  }

  private async getPendingJoke(id: string): Promise<Joke | null> {
    const joke = await this.redisClient.get(id);
    if (joke) {
      await this.redisClient.del(id);
      return JSON.parse(joke);
    }
    return null;
  }

  // private removeChatMessage(interaction: DiscordInteractionMessage) {
  //   removeBotMsg(interaction.token, interaction.message.id).catch(console.log);
  // }

  private async handleWakeUp(interaction: DiscordInteraction, res: Response) {
    const isAwaken = await this.getAwakeTime(interaction);
    if (isAwaken) {
      res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: res.__("bot.already_awake"),
        },
      });
    } else {
      res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: res.__(RandomAnswers.GET_RANDOM_WOKE_UP_KEY()),
        },
      });
    }
  }

  private async setAwakeFlag(interaction: DiscordInteraction) {
    const id: string = this.getAwakeId(interaction);
    await this.redisClient.set(id, "true", { TTL: 30 });
  }

  private async getAwakeTime(interaction: DiscordInteraction) {
    const id: string = this.getAwakeId(interaction);
    const isAwaken = Boolean(await this.redisClient.get(id));
    return isAwaken;
  }

  private getAwakeId(interaction: DiscordInteraction) {
    return interaction.context === DiscordContext.BOT_DM
      ? (interaction.user?.id as string)
      : (interaction.guild_id as string);
  }

  private updateChatMessage(
    interaction: DiscordInteractionMessage,
    newMessage: unknown,
  ) {
    updateBotMessage(
      { messageId: interaction.message.id as string, token: interaction.token },
      newMessage,
    ).catch(console.log);
  }

  private readonly gitTags: string[] = ["Laughs", "jokes", "funny"];

  private getRandomGifTag(): string {
    return this.gitTags[
      Math.max(0, Math.ceil(Math.random() * this.gitTags.length - 1))
    ];
  }
}
