export type NoteEvent =
  | {
      type: "note_on";
      pitch: number;
      velocity: number;
    }
  | {
      type: "note_off";
      pitch: number;
    }
  | {
      type: "all_notes_off";
    };

export type NoteSequence = {
  notes: (NoteEvent & { position: number })[];
  length: number;
};

export type PinDataTypes = {
  execution: null;
  integer: number;
  boolean: boolean;
  noteEvents: NoteEvent[];
  noteSequence: NoteSequence;
};

export type PinDataType = keyof PinDataTypes;

export type PinIOType = "input" | "output";

export const pinDataTypeNames: PinDataType[] = [
  "execution",
  "integer",
  "boolean",
  "noteEvents",
  "noteSequence",
];
