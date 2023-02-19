import { commandHandler } from "@/communication/commandHandler";
import { eventHandler } from "@/communication/eventHandler";

export type HandlerPlayerMidiOutput = {
  id: string;
  name: string;
};

export const evtsPlayer = eventHandler<{
  update_midi_outputs: null;
}>();

export const cmdsPlayer = commandHandler<{
  midi_outputs: [null, HandlerPlayerMidiOutput[]];
}>();
