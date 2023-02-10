import type { CoreManager } from "../CoreManager";
import type { GraphNode } from "./GraphNode";

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
    const startNode = this.coreManager
      .newNode(this.id, "TestNode")
      .unwrap() as GraphNode;
    const outputNode = this.coreManager
      .newNode(this.id, "TestNode")
      .unwrap() as GraphNode;

    // outputNode.x = 10;
    // this.coreManager.evtsCore.emit("update_node", { id: outputNode.id });
  }
}
