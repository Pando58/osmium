import { commandHandler } from "@/communication/commandHandler";
import { eventHandler } from "@/communication/eventHandler";

export type CoreEventMap = {
  update_tracks: null;
  update_track: { id: number };
  update_section: { id: number };
  update_graphs: null;
  update_graph: { id: number };
};

type CoreCommandMap = {
  track_ids: [null, number[]];
  track: [{ id: number }, HandlerCoreTrack];
  section: [{ id: number }, HandlerCoreSection];
  graph_ids: [null, number[]];
  graph: [{ id: number }, HandlerCoreGraph];
};

export type HandlerCoreTrack = {
  id: number;
  sectionIds: number[];
  name: string;
};

export type HandlerCoreSection = {
  id: number;
  position: number;
  length: number;
};

export type HandlerCoreGraph = {
  id: number;
  name: string;
};

export const evtsCore = eventHandler<CoreEventMap>();
export const cmdsCore = commandHandler<CoreCommandMap>();
