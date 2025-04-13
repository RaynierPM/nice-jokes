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
import { getRandomJoke } from "../jokes";
import { BotResponses } from "../common/responses/bot/defaults";
import { DiscordUnexpectedError } from "../errors/discord/discordUnexpectedErro";
import { updateBotMessage } from "../discord/commons/updateBotMessage";
import moment, { Moment } from "moment";

export class InteractionsController
  implements Controller<InteractionsController>
{
  private readonly pendingJokes: Record<string, Joke> = {};
  private lastWakeUp: Record<string, Moment> = {};

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
      case availableComands.JOKE:
        try {
          const joke = await getRandomJoke("en");
          this.savePendingJoke({ joke, interaction });
          BotResponses.joke(res, { interaction, joke });
        } catch {
          throw new DiscordUnexpectedError();
        }
        break;
      case availableComands.WAKE_UP:
        this.handleWakeUp(interaction, res);
        break;
    }
    this.setAwakeTime(interaction);
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
      const joke = this.getPendingJoke(jokeId);
      if (joke) {
        this.updateChatMessage(interaction, {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: joke.setup },
          components: [],
        });
        BotResponses.punchLine(res, joke.punchline);
      } else {
        BotResponses.alzheimer(res);
      }
    }
  }

  private savePendingJoke({
    joke,
    interaction,
  }: {
    joke: Joke;
    interaction: DiscordInteraction;
  }) {
    this.pendingJokes[interaction.id as string] = joke;
  }

  private getPendingJoke(id: string) {
    const joke = this.pendingJokes[id];
    if (joke) delete this.pendingJokes[id];
    return joke;
  }

  // private removeChatMessage(interaction: DiscordInteractionMessage) {
  //   removeBotMsg(interaction.token, interaction.message.id).catch(console.log);
  // }

  private handleWakeUp(interaction: DiscordInteraction, res: Response) {
    const lastWakeUp = this.getAwakeTime(interaction);
    if (lastWakeUp && moment().diff(lastWakeUp, "minute") < 30) {
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

  private setAwakeTime(interaction: DiscordInteraction) {
    const id: string = this.getAwakeId(interaction);
    this.lastWakeUp[id] = moment();
  }

  private getAwakeTime(interaction: DiscordInteraction) {
    const id: string = this.getAwakeId(interaction);
    return this.lastWakeUp[id];
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
}
