import { eventHandler } from "@/communication/eventHandler";

export const evtsUI = eventHandler<{
  create_track: null;
  create_section: { trackId: number };
}>();
