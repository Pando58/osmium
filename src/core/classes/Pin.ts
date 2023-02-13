import type { PinDataType, PinIOType } from "./pinDataTypes/pinDataTypes";

export class Pin<
  T extends PinDataType = PinDataType,
  U extends PinIOType = PinIOType
> {
  id: number;
  name = "";
  dataType: T;
  ioType: U;
  connectedPin: Pin | null = null;

  constructor(dataType: T, ioType: U, id: number) {
    this.dataType = dataType;
    this.ioType = ioType;
    this.id = id;
  }

  connect(pin: Pin) {
    if (this.dataType !== pin.dataType) 
      return console.error("Pins need to have the same data type to be connected"); // prettier-ignore

    if (this.ioType === pin.ioType)
      return console.error("Pins of the same io type cannot be connected");

    if (this.canHaveConnectedPin()) {
      this.connectedPin = pin;
    } else {
      pin.connectedPin = this;
    }
  }

  disconnect() {
    if (!this.connectedPin) {
      console.error(`Node with id ${this.id} is not connected`);
    }

    this.connectedPin = null;
  }

  canHaveConnectedPin() {
    return (
      (this.dataType === "execution" && this.ioType === "output") ||
      (this.dataType !== "execution" && this.ioType === "input")
    );
  }
}
