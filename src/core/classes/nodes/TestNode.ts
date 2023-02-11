import type { CoreManager } from "@/core/CoreManager";
import { GraphNode } from "../GraphNode";

export class TestNode extends GraphNode {
  constructor(id: number, coreManager: CoreManager) {
    super(id, coreManager);

    this.name = "Test Node";
  }
}
