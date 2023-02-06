import { eventHandler } from "@/communication/eventHandler";
import type { HandlerCoreSection } from "@/core/communication/handlers";

export const evtsUI = eventHandler<{
  create_track: null;
  create_section: { trackId: number };
  update_section: {
    sectionId: number;
    props: Partial<Omit<HandlerCoreSection, "id">>;
  };
  create_graph: null;
}>();
