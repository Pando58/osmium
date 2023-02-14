import type { CoreManager } from "@/core/CoreManager";
import { GraphNode } from "../GraphNode";

export class OnPlay extends GraphNode {
  constructor(id: number, coreManager: CoreManager) {
    super(id, coreManager);
  }

  init() {
    this.name = "On Play";

    const execOutput = this.coreManager
      .newPin(this.id, "execution", "output")
      .unwrap()!;
  }
}
