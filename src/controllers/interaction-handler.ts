import { Request, Response } from "express";
import { Controller } from "../common/interfaces";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import {
  DiscordInteraction,
  DiscordInteractionMessage,
} from "../discord/types/applicationCommand";
import { availableComands } from "../discord/commands/availableCommands.enum";
import { RandomAnswers } from "../common/utils/randomAnswers";
import { getRandomJoke, translateJoke } from "../jokes";
import { BotResponses } from "../common/responses/defaults";
import { DiscordUnexpectedError } from "../errors/discord/discordUnexpectedErro";
import { removeBotMsg } from "../discord/commons/removeBotMessage";
import { updateBotMessage } from "../discord/commons/updateBotMessage";
import { isEnglishLocale } from "../common/utils/isEnglishLocal";

export class InteractionsController
  implements Controller<InteractionsController>
{
  private readonly pendingJokes: Record<string, Joke> = {};

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
          console.log({ joke });
          this.savePendingJoke({ joke, interaction });
          BotResponses.joke(res, { interaction, joke });
        } catch {
          throw new DiscordUnexpectedError();
        }
        break;
      case availableComands.WAKE_UP:
        res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: res.__(RandomAnswers.GET_RANDOM_WOKE_UP_KEY()),
          },
        });
        break;
    }
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
