import { commandHandler } from "@/communication/commandHandler";
import { eventHandler } from "@/communication/eventHandler";

export const evtsCore = eventHandler<{
  update_tracks: null;
  update_track: { id: number };
  update_section: { id: number };
}>();

export const cmdsCore = commandHandler<{
  track_ids: [null, number[]];
  track: [{ id: number }, HandlerCoreTrack];
  section: [{ id: number }, HandlerCoreSection];
}>();

export type HandlerCoreTrack = {
  id: number;
  sectionIds: number[];
  name: string;
};

export type HandlerCoreSection = {
  id: number;
  start: number;
  end: number;
};
