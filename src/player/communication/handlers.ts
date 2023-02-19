import { commandHandler } from "@/communication/commandHandler";
import { eventHandler } from "@/communication/eventHandler";

export type HandlerPlayerMidiOutput = {
  id: string;
  name: string;
};

export type PlayerEventMap = {
  update_midi_outputs: null;
  graph_play: { id: number; instanceId: number };
  graph_stop: { id: number; instanceId: number };
};

type PlayerCommandMap = {
  midi_outputs: [null, HandlerPlayerMidiOutput[]];
};

export const evtsPlayer = eventHandler<PlayerEventMap>();
export const cmdsPlayer = commandHandler<PlayerCommandMap>();
