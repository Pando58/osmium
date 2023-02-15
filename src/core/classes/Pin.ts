import { generateDefaultValue } from "./pinDataTypes/generateDefaultValue";
import type {
  PinDataType,
  PinDataTypes,
  PinIOType,
} from "./pinDataTypes/pinDataTypes";

export class Pin<
  T extends PinDataType = PinDataType,
  U extends PinIOType = PinIOType
> {
  id: number;
  name = "";
  dataType: T;
  ioType: U;
  connectedPin: Pin | null = null;
  defaultValue: PinDataTypes[T];
  value: PinDataTypes[T] | null = null;

  constructor(dataType: T, ioType: U, id: number) {
    this.dataType = dataType;
    this.ioType = ioType;
    this.id = id;
    this.defaultValue = generateDefaultValue(dataType);
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

  setValue(val: Exclude<PinDataTypes[T], null>) {
    this.value = val;
  }

  trigger(): PinDataTypes[T] | null {
    if (this.canHaveConnectedPin()) {
      if (this.connectedPin) {
        const val = this.connectedPin.trigger() as PinDataTypes[T] | null;

        return val !== null
          ? val
          : this.value !== null
          ? this.value
          : this.defaultValue;
      }
    }

    return this.value as PinDataTypes[T] | null;
  }

  // onTrigger() {}
}
