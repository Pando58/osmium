export type PinDataTypes = {
  execution: null;
  integer: number;
  boolean: boolean;
};

export type PinDataType = keyof PinDataTypes;

export type PinIOType = "input" | "output";

export const pinDataTypeNames: PinDataType[] = [
  "execution",
  "integer",
  "boolean",
];
