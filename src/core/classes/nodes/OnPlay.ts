import type { CoreManager } from "@/core/CoreManager";
import { GraphNode } from "../GraphNode";
import type { Pin } from "../Pin";

export class OnPlay extends GraphNode {
  pPlay: Pin<"execution", "output"> = null!;

  constructor(id: number, coreManager: CoreManager) {
    super(id, coreManager);
  }

  init() {
    this.name = "On Play";

    this.pPlay = this.coreManager
      .newPin(this.id, "execution", "output")
      .unwrap()!;
  }
}
