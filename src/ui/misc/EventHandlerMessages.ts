import type { EventHandler } from "@/communication/eventHandler";

export type EventHandlerMessages<C extends EventHandler<any>> =
  C extends EventHandler<infer T> ? T : unknown;
