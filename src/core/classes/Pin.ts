import type { PinDataType, PinIOType } from "./pinDataTypes/pinDataTypes";

export class Pin<
  T extends PinDataType = PinDataType,
  U extends PinIOType = PinIOType
> {
  name = "";
  dataType: T;
  ioType: U;

  constructor(dataType: T, ioType: U) {
    this.dataType = dataType;
    this.ioType = ioType;
  }
}
