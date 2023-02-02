import { commandHandler } from "@/communication/commandHandler";
import { eventHandler } from "@/communication/eventHandler";

export const evtsCore = eventHandler<{
  update_tracks: null;
  update_sections: null;
}>();

export const cmdsCore = commandHandler<{
  tracks: [null, HandlerCoreTrack[]];
  sections: [{ trackId: number }, HandlerCoreSection[]];
}>();

export type HandlerCoreTrack = {
  id: number;
  name: string;
  sections: number[];
};

export type HandlerCoreSection = {
  id: number;
  start: number;
  end: number;
};
