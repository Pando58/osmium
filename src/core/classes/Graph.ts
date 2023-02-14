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
    const nOnPlay = this.coreManager.newNode(this.id, "OnPlay").unwrap()!;
    const nOutput = this.coreManager.newNode(this.id, "OutputNode").unwrap()!;

    nOnPlay.x = 2;
    nOnPlay.y = 2;
    nOutput.x = 15;
    nOutput.y = 2;
  }
}
