type NoteEvent =
  | {
      type: "note_on";
      pitch: number;
      velocity: number;
    }
  | {
      type: "note_off";
      pitch: number;
    };

export type PinDataTypes = {
  execution: null;
  integer: number;
  boolean: boolean;
  noteEvents: NoteEvent[];
};

export type PinDataType = keyof PinDataTypes;

export type PinIOType = "input" | "output";

export const pinDataTypeNames: PinDataType[] = [
  "execution",
  "integer",
  "boolean",
  "noteEvents",
];
