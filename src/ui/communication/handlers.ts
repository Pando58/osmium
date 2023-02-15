import { eventHandler } from "@/communication/eventHandler";
import type { UIAddNodes } from "@/core/classes/nodes/factory/nodeFactories";
import type { HandlerCoreSection } from "@/core/communication/handlers";

export const evtsUI = eventHandler<{
  create_track: null;
  create_section: { trackId: number };
  update_section: {
    sectionId: number;
    props: Partial<Omit<HandlerCoreSection, "id">>;
  };
  create_graph: null;
  create_node: { graphId: number; type: UIAddNodes; x: number; y: number };
  delete_node: { id: number };
  move_node: { id: number; x: number; y: number };
  connect_pins: { id1: number; id2: number };
  disconnect_pin: { id: number };
}>();
