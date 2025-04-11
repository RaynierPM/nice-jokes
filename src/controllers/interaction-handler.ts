import { Request, Response } from "express";
import { Controller } from "../common/interfaces";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import {
  DiscordInteraction,
  DiscordInteractionMessage,
} from "../discord/types/applicationCommand";
import { availableComands } from "../discord/commands/availableCommands.enum";
import { RandomAnswers } from "../common/utils/randomAnswers";
import { getRandomJoke } from "../jokes";
import { BotResponses } from "../common/responses/defaults";
import { DiscordUnexpectedError } from "../errors/discord/discordUnexpectedErro";
import { removeBotMsg } from "../discord/commons/removeBotMessage";
import { updateBotMessage } from "../discord/commons/updateBotMessage";

export class InteractionsController
  implements Controller<InteractionsController>
{
  private readonly jokesRecords: Record<string, Joke> = {};

  handleInteractions = async (req: Request, res: Response) => {
    const { type } = req.body;

    switch (type as InteractionType) {
      // case InteractionType.PING:
      //   break;
      case InteractionType.APPLICATION_COMMAND:
        await this.handleAppCommand(req.body, res);
        break;
      case InteractionType.MESSAGE_COMPONENT:
        this.handleMessageComponent(req.body, res);
        break;
      default:
        BotResponses.NotAvailableCommand(res);
        break;
    }
  };

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
          const { data: joke } = await getRandomJoke();
          this.saveJokePunchLine({ joke, interaction });
          BotResponses.joke(res, { interaction, joke });
        } catch {
          BotResponses.unexpectedErrorMsg(res);
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

  private saveJokePunchLine({
    joke,
    interaction,
  }: {
    joke: Joke;
    interaction: DiscordInteraction;
  }) {
    this.jokesRecords[interaction.id as string] = joke;
  }

  private getPendingJoke(id: string) {
    const joke = this.jokesRecords[id];
    if (joke) delete this.jokesRecords[id];
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
    )
      .catch(console.log)
      .then(console.log);
  }
}
