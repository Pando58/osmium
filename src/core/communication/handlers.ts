import { commandHandler } from "@/communication/commandHandler";
import { eventHandler } from "@/communication/eventHandler";
import type {
  PinDataType,
  PinDataTypes,
  PinIOType,
} from "../classes/pinDataTypes/pinDataTypes";

export type CoreEventMap = {
  update_tracks: null;
  update_track: { id: number };
  update_section: { id: number };
  update_graphs: null;
  update_graph: { id: number };
  update_node: { id: number };
};

type CoreCommandMap = {
  track_ids: [null, number[]];
  track: [{ id: number }, HandlerCoreTrack];
  section: [{ id: number }, HandlerCoreSection];
  graph_ids: [null, number[]];
  graph: [{ id: number }, HandlerCoreGraph];
  node: [{ id: number }, HandlerCoreNode];
  pin: [{ id: number }, HandlerCorePin];
};

export type HandlerCoreTrack = {
  id: number;
  sectionIds: number[];
  name: string;
  midiOutputId: string | null;
  midiOutputChannel: number;
};

export type HandlerCoreSection = {
  id: number;
  position: number;
  length: number;
  graphId: number | null;
};

export type HandlerCoreGraph = {
  id: number;
  nodeIds: number[];
  name: string;
};

export type HandlerCoreNode = {
  id: number;
  pinIds: number[];
  name: string;
  x: number;
  y: number;
};

export type HandlerCorePin = {
  id: number;
  name: string;
  dataType: PinDataType;
  ioType: PinIOType;
  connectedPinId: number | null;
  defaultValue: PinDataTypes[PinDataType];
};

export const evtsCore = eventHandler<CoreEventMap>();
export const cmdsCore = commandHandler<CoreCommandMap>();
