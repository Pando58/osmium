import type { CommandHandler } from "@/communication/commandHandler";
import type { EventHandler } from "@/communication/eventHandler";
import type { CoreCommandMap } from "@/core/communication/handlers";
import type { PlayerEventMap } from "../communication/handlers";

export interface PlayerManager {
  evtsPlayer: EventHandler<PlayerEventMap>;
  cmdsCore: CommandHandler<CoreCommandMap>;
}
