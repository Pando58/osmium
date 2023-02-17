import { getNextId } from "@/misc/getNextId";
import type { CoreManager } from "../CoreManager";
import type { GraphNode } from "./GraphNode";
import type { OnPlay, OutputNode } from "./nodes";

export class Graph {
  coreManager: CoreManager;
  id: number;
  nodeIds: number[] = [];
  name = "";
  nodesOrdered: GraphNode[] = [];
  instanceIds: Set<number> = new Set();
  nOnPlay: OnPlay = null!;
  nOutput: OutputNode = null!;

  constructor(id: number, coreManager: CoreManager) {
    this.id = id;
    this.coreManager = coreManager;
  }

  init() {
    this.nOnPlay = this.coreManager
      .newNode(this.id, "OnPlay")
      .unwrap() as OnPlay;
    this.nOutput = this.coreManager
      .newNode(this.id, "OutputNode")
      .unwrap() as OutputNode;

    this.nOnPlay.x = 2;
    this.nOnPlay.y = 2;
    this.nOutput.x = 15;
    this.nOutput.y = 2;
  }

  play(instanceId: number) {
    this.nodesOrdered = [...this.nOnPlay.getConnectedNodes().values()];

    this.nOnPlay.pPlay.trigger(instanceId);
  }

  step(instanceId: number) {
    for (const node of this.nodesOrdered) {
      node.step(instanceId);
    }
  }

  instance() {
    const instanceId = getNextId(this.instanceIds);
    this.instanceIds.add(instanceId);

    for (const nodeId of this.nodeIds) {
      const node = this.coreManager.getNode(nodeId).unwrap()!;

      if (!node) continue;

      node.instance(instanceId);
    }

    return instanceId;
  }
}
