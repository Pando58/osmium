import type { GraphNode } from "./GraphNode";
import { generateDefaultValue } from "./pinDataTypes/generateDefaultValue";
import {
  pinDataTypesSchema,
  type PinDataType,
  type PinDataTypes,
  type PinIOType,
} from "./pinDataTypes/pinDataTypes";

export class Pin<
  T extends PinDataType = PinDataType,
  U extends PinIOType = PinIOType
> {
  id: number;
  node: GraphNode;
  name = "";
  dataType: T;
  ioType: U;
  connectedPin: Pin | null = null;
  defaultValue: PinDataTypes[T];
  states: Map<number, PinDataTypes[T] | null> = new Map();
  onTriggerFn = (_instanceId: number) => {};

  constructor(dataType: T, ioType: U, id: number, node: GraphNode) {
    this.dataType = dataType;
    this.ioType = ioType;
    this.id = id;
    this.node = node;
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

  setValue(instanceId: number, val: Exclude<PinDataTypes[T], null>) {
    if (!this.states.has(instanceId)) return;

    this.states.set(instanceId, val);
  }

  setDefaultValue(val: PinDataTypes[PinDataType]) {
    const parse = pinDataTypesSchema.shape[this.dataType].safeParse(val);

    if (!parse.success) {
      return console.error(parse.error);
    }

    this.defaultValue = val as any;
  }

  trigger(instanceId: number): PinDataTypes[T] | null {
    const state = this.states.get(instanceId);
    if (state === undefined) return null;

    this.onTriggerFn(instanceId);

    if (this.canHaveConnectedPin()) {
      if (this.connectedPin) {
        const val = this.connectedPin.trigger(instanceId) as
          | PinDataTypes[T]
          | null;

        if (val !== null) return val;
      }

      return this.defaultValue;
    }

    return state as PinDataTypes[T] | null;
  }

  onTrigger(fn: (instanceId: number) => void) {
    this.onTriggerFn = fn;
  }

  instance(instanceId: number) {
    this.states.set(instanceId, null);
  }
}
