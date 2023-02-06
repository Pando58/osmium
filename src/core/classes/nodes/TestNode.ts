import { GraphNode } from "../GraphNode";

export class TestNode extends GraphNode {
  constructor(id: number) {
    super(id);

    this.name = "Test Node";
  }
}
