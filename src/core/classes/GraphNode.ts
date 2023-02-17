import type { CoreManager } from "../CoreManager";
import type { Pin } from "./Pin";

export class GraphNode {
  coreManager: CoreManager;
  id: number;
  pinIds: number[] = [];
  name = "";
  x = 0;
  y = 0;
  states: Map<number, Record<string, any>> = new Map();

  constructor(id: number, coreManager: CoreManager) {
    this.id = id;
    this.coreManager = coreManager;
  }

  init() {}

  step(_instanceId: number) {}

  getConnectedNodes(nodes?: Set<GraphNode>): Set<GraphNode> {
    if (!nodes) nodes = new Set([this]);

    const localNodes = new Set<GraphNode>();

    const pins: Pin<"execution", "output">[] = [];

    for (const pinId of this.pinIds) {
      const pin = this.coreManager.getPin(pinId).unwrap();

      if (!pin) continue;
      if (pin.dataType !== "execution" || pin.ioType !== "output") continue;

      pins.push(pin as Pin<"execution", "output">);
    }

    for (const pin of pins) {
      if (!pin.connectedPin) continue;

      const { node } = pin.connectedPin;

      if (nodes.has(node)) continue;

      nodes.add(node);
      localNodes.add(node);
    }

    for (const node of localNodes) {
      node.getConnectedNodes(nodes);
    }

    return nodes;
  }

  createState(_instanceId: number) {}

  instance(instanceId: number) {
    this.createState(instanceId);

    for (const pinId of this.pinIds) {
      const pin = this.coreManager.getPin(pinId).unwrap()!;

      if (!pin) continue;

      pin.instance(instanceId);
    }
  }
}
