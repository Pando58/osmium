import { eventHandler } from "@/communication/eventHandler";
import type { UIAddNodes } from "@/core/classes/nodes/factory/nodeFactories";
import type {
  PinDataType,
  PinDataTypes,
} from "@/core/classes/pinDataTypes/pinDataTypes";
import type { HandlerCoreSection } from "@/core/communication/handlers";

export const evtsUI = eventHandler<{
  create_track: null;
  update_track_midi_output_id: {
    id: number;
    outputId: string | null;
  };
  update_track_midi_output_channel: {
    id: number;
    channel: number;
  };
  create_section: { trackId: number };
  update_section: {
    sectionId: number;
    props: Partial<Omit<HandlerCoreSection, "id">>;
  };
  update_section_graph: { id: number; graphId: number | null };
  create_graph: null;
  create_node: { graphId: number; type: UIAddNodes; x: number; y: number };
  delete_node: { id: number };
  move_node: { id: number; x: number; y: number };
  connect_pins: { id1: number; id2: number };
  disconnect_pin: { id: number };
  update_pin_default_value: { id: number; value: PinDataTypes[PinDataType] };
  play: null;
}>();
