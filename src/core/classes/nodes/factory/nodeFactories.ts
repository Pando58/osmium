import type { GraphNode } from "../../GraphNode";
import * as nodes from "../index";

export type NodeFactory = {
  name: keyof typeof nodes;
  create: () => GraphNode;
};

export const nodeFactories: NodeFactory[] = Object.entries(nodes).map(
  ([name, nodeClass]) => ({
    name: name as keyof typeof nodes,
    create: (): GraphNode => new nodeClass(),
  })
);
