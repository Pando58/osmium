import type { CoreManager } from "@/core/CoreManager";
import { GraphNode } from "../GraphNode";

export class OutputNode extends GraphNode {
  constructor(id: number, coreManager: CoreManager) {
    super(id, coreManager);
  }

  init() {
    this.name = "Output";

    const dataInput = this.coreManager
      .newPin(this.id, "boolean", "input")
      .unwrap()!;
  }
}
