import { handleStore } from "@/ui/misc/handleStore";
import type { Writable } from "svelte/store";
import type { SecWindow } from "./types";

type Params = [
  Writable<number | null>,
  Writable<Map<number, SecWindow>>,
  Writable<number>,
  Writable<number>
];

export function pointerHandling([
  draggedWindowIdStore,
  windowsStore,
  draggedWindowOffsetXStore,
  draggedWindowOffsetYStore,
]: Params) {
  const draggedWindowId = handleStore(draggedWindowIdStore);
  const windows = handleStore(windowsStore);
  const draggedWindowOffsetX = handleStore(draggedWindowOffsetXStore);
  const draggedWindowOffsetY = handleStore(draggedWindowOffsetYStore);

  const onPointerUp = () => {
    draggedWindowId.value = null;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (draggedWindowId.value !== null) {
      const win = windows.value.get(draggedWindowId.value);

      if (!win) return;
      if (!win.floating) return;

      win.x = Math.max(
        Math.min(e.clientX - draggedWindowOffsetX.value, innerWidth - 20),
        20 - win.w
      );
      win.y = Math.max(
        Math.min(e.clientY - draggedWindowOffsetY.value, innerHeight - 20),
        20 - win.h
      );

      windows.value = windows.value;
    }
  };

  addEventListener("pointerup", onPointerUp);
  addEventListener("pointermove", onPointerMove);

  return () => {
    removeEventListener("pointerup", onPointerUp);
    removeEventListener("pointermove", onPointerMove);
  };
}
