import type { CoreManager } from "@/core/CoreManager";
import type { GraphNode } from "../../GraphNode";
import * as nodes from "../index";

export type NodeFactory = {
  name: keyof typeof nodes;
  create: (id: number, coreManager: CoreManager) => GraphNode;
};

export const nodeFactories: NodeFactory[] = Object.entries(nodes).map(
  ([name, nodeClass]) => ({
    name: name as keyof typeof nodes,
    create: (id: number, coreManager: CoreManager): GraphNode =>
      new nodeClass(id, coreManager),
  })
);
