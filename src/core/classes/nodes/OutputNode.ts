import type { CoreManager } from "@/core/CoreManager";
import { GraphNode } from "../GraphNode";
import type { Pin } from "../Pin";

export class OutputNode extends GraphNode {
  pNoteEvents: Pin<"noteEvents", "input"> = null!;

  constructor(id: number, coreManager: CoreManager) {
    super(id, coreManager);
  }

  init() {
    this.name = "Output";

    this.pNoteEvents = this.coreManager
      .newPin(this.id, "noteEvents", "input")
      .unwrap()!;
  }
}
