export type PinDataTypes = {
  execution: never;
  integer: number;
  boolean: boolean;
};

export type PinDataType = keyof PinDataTypes;

export type PinIOType = "input" | "output";
