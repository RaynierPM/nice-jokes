import { Request, Response } from "express";
import { Controller } from "../common/interfaces";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { DiscordInteraction } from "../discord/types/applicationCommand";
import { availableComands } from "../discord/commands/availableCommands.enum";
import { RandomAnswers } from "../common/utils/randomAnswers";

export class InteractionsController
  implements Controller<InteractionsController>
{
  handleInteractions = async (req: Request, res: Response) => {
    const { type } = req.body;

    switch (type as InteractionType) {
      case InteractionType.PING:
        break;
      case InteractionType.APPLICATION_COMMAND:
        await this.handleAppCommand(req.body, res);
        break;
      case InteractionType.MESSAGE_COMPONENT:
        break;
    }
  };

  private async handleAppCommand(
    interaction: DiscordInteraction,
    res: Response,
  ) {
    const { name } = interaction.data;

    switch (name) {
      case availableComands.PING:
        res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: res.__(RandomAnswers.GET_RANDOM_PING_INDEX()),
          },
        });
        break;
      case availableComands.JOKE:
        res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: res.__("bot.command_not_available"),
          },
        });
        break;
      case availableComands.WAKE_UP:
        res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: res.__("bot.command_not_available"),
          },
        });
        break;
    }
  }
}
