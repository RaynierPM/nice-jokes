import { Request, Response } from "express";
import { Controller } from "../common/interfaces";
import { InteractionType, InteractionResponseType } from "discord-interactions";

export class InteractionsController
  implements Controller<InteractionsController>
{
  handleInteractions = async (req: Request, res: Response) => {
    const { id, type } = req.body;

    switch (type as InteractionType) {
      case InteractionType.PING:
        break;
      case InteractionType.APPLICATION_COMMAND:
        res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "I'm alive, and say: PONG!",
          },
        });
        break;
      case InteractionType.MESSAGE_COMPONENT:
        break;
    }
  };
}
