import type { PinDataType } from "./pinDataTypes";

export function generateDefaultValue<T extends PinDataType>(dataType: T): any {
  if (dataType === "integer") return 0;
  if (dataType === "boolean") return false;

  return null;
}
