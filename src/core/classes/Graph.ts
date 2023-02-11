import type { CoreManager } from "../CoreManager";

export class Graph {
  coreManager: CoreManager;
  id: number;
  nodeIds: number[] = [];
  name = "";

  constructor(id: number, coreManager: CoreManager) {
    this.id = id;
    this.coreManager = coreManager;
  }

  init() {
    const startNode = this.coreManager.newNode(this.id, "TestNode").unwrap()!;
    const outputNode = this.coreManager.newNode(this.id, "TestNode").unwrap()!;

    outputNode.x = 10;
  }
}
