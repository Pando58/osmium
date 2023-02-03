<script lang="ts">
  import { onDestroy } from "svelte";
  import SectionWindow from "../SectionWindow/SectionWindow.svelte";
  import WindowTracks from "../WindowTracks/WindowTracks.svelte";

  interface SecWindow {
    floating: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    tabs: Map<
      number,
      {
        name: string;
        component: ConstructorOfATypedSvelteComponent;
      }
    >;
  }

  let windows: Map<number, SecWindow> = new Map([
    [
      0,
      {
        floating: true,
        x: 20,
        y: 20,
        w: 600,
        h: 600,
        tabs: new Map([
          [
            0,
            {
              name: "Tracks",
              component: WindowTracks,
            },
          ],
        ]),
      },
    ],
    [
      1,
      {
        floating: true,
        x: 700,
        y: 20,
        w: 600,
        h: 600,
        tabs: new Map([
          [
            0,
            {
              name: "Tracks",
              component: WindowTracks,
            },
          ],
        ]),
      },
    ],
  ]);

  // Window dragging
  let draggedWindowId: number | null = null;
  let draggedWindowOffsetX = 0;
  let draggedWindowOffsetY = 0;

  function onPointerDownWindow({
    detail,
  }: CustomEvent<{
    windowId: number;
    x: number;
    y: number;
  }>) {
    draggedWindowId = detail.windowId;

    draggedWindowOffsetX = detail.x;
    draggedWindowOffsetY = detail.y;
  }

  const onPointerUp = () => {
    draggedWindowId = null;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (draggedWindowId !== null) {
      const win = windows.get(draggedWindowId);

      if (!win) return;
      if (!win.floating) return;

      win.x = Math.max(
        Math.min(e.clientX - draggedWindowOffsetX, innerWidth - 20),
        20 - win.w
      );
      win.y = Math.max(
        Math.min(e.clientY - draggedWindowOffsetY, innerHeight - 20),
        20 - win.h
      );

      windows = windows;
    }
  };

  addEventListener("pointerup", onPointerUp);
  addEventListener("pointermove", onPointerMove);

  onDestroy(() => {
    removeEventListener("pointerup", onPointerUp);
    removeEventListener("pointermove", onPointerMove);
  });

  function onToggleFloating({ detail }: CustomEvent<{ windowId: number }>) {
    const win = windows.get(detail.windowId);

    if (!win) return;

    win.floating = !win.floating;
    windows = windows;
  }
</script>

<div class="absolute inset-0 flex overflow-hidden">
  {#each [...windows.entries()] as [windowId, win]}
    <SectionWindow
      id={windowId}
      {...win}
      on:pointerdown_window={onPointerDownWindow}
      on:toggle_floating={onToggleFloating}
    />
  {/each}
</div>
