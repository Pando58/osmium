import { getNextId } from "@/misc/getNextId";
import type { Writable } from "svelte/store";
import type { WindowConfig } from "../appContext";
import { handleStore } from "../misc/handleStore";
import type { SecWindow } from "./types";

export function createWindowHandler(
  { floating, pos, w, h, tabs }: WindowConfig,
  mainContainer: HTMLDivElement,
  windowsStore: Writable<Map<number, SecWindow>>
) {
  const windows = handleStore(windowsStore);

  let x: number;
  let y: number;

  if (pos === "center") {
    const { width, height } = mainContainer.getBoundingClientRect();

    x = width / 2 - w / 2;
    y = height / 2 - h / 2;
  } else {
    x = pos[0];
    y = pos[1];
  }

  windows.value.set(getNextId(windows.value), {
    floating,
    x,
    y,
    w,
    h,
    tabs: new Map(tabs.map((tab, i) => [i, tab])),
  });

  windows.value = windows.value;
}
