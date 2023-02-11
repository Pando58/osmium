import type { CoreManager } from "../CoreManager";

export class GraphNode {
  coreManager: CoreManager;
  id: number;
  pinIds: number[] = [];
  name = "";
  x = 0;
  y = 0;

  constructor(id: number, coreManager: CoreManager) {
    this.id = id;
    this.coreManager = coreManager;
  }

  init() {}
}
