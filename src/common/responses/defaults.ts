import {
  InteractionResponseType,
  MessageComponentTypes,
} from "discord-interactions";
import { Response } from "express";
import { DiscordInteraction } from "../../discord/types/applicationCommand";
import { RandomAnswers } from "../utils/randomAnswers";
import { HttpStatusCode } from "axios";

export abstract class BotResponses {
  static NotAvailableCommand(res: Response): void {
    res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: res.__("bot.command_not_available"),
      },
    });
  }

  static joke(
    res: Response,
    data: { interaction: DiscordInteraction; joke: Joke },
  ) {
    res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: data.joke.setup,
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                label: res.__("sorprise_me"),
                style: 1,
                custom_id: `joke_punchline_${data.interaction.id}`,
              },
            ],
          },
        ],
      },
    });
  }

  static punchLine(res: Response, punchLine: string) {
    res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: punchLine,
      },
    });
  }

  static alzheimer(res: Response) {
    res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: res.__(RandomAnswers.GET_RANDOM_IDK_KEY()),
      },
    });
  }

  static unexpectedErrorMsg(res: Response) {
    res.status(HttpStatusCode.InternalServerError).json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: res.__("bot.unexpected_error"),
      },
    });
  }
}
