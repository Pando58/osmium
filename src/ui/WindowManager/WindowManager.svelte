<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { appKey, type AppContext } from "../appContext";
  import SectionWindow from "../SectionWindow/SectionWindow.svelte";
  import WindowTracks from "../WindowTracks/WindowTracks.svelte";
  import { createWindowHandler } from "./createWindowHandler";
  import { pointerHandling } from "./pointerHandling";
  import type { SecWindow } from "./types";

  let mainContainer: HTMLDivElement;

  const windows: Writable<Map<number, SecWindow>> = writable(
    new Map([
      [
        0,
        {
          floating: false,
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
          floating: false,
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
    ])
  );

  const { onCreateWindow } = getContext<AppContext>(appKey);

  onCreateWindow((params) =>
    createWindowHandler(params, mainContainer, windows)
  );

  // Window dragging
  const draggedWindowId = writable<number | null>(null);
  const draggedWindowOffsetX = writable(0);
  const draggedWindowOffsetY = writable(0);

  const pointerHandlingOnDestroy = pointerHandling([
    draggedWindowId,
    windows,
    draggedWindowOffsetX,
    draggedWindowOffsetY,
  ]);

  function onPointerDownWindow({
    detail,
  }: CustomEvent<{
    windowId: number;
    x: number;
    y: number;
  }>) {
    $draggedWindowId = detail.windowId;

    $draggedWindowOffsetX = detail.x;
    $draggedWindowOffsetY = detail.y;
  }

  function onToggleFloating({ detail }: CustomEvent<{ windowId: number }>) {
    const win = $windows.get(detail.windowId);

    if (!win) return;

    win.floating = !win.floating;
    $windows = $windows;
  }

  //
  onDestroy(() => {
    pointerHandlingOnDestroy();
  });
</script>

<div class="absolute inset-0 flex overflow-hidden" bind:this={mainContainer}>
  {#each [...$windows.entries()] as [windowId, win]}
    <SectionWindow
      id={windowId}
      {...win}
      on:pointerdown_window={onPointerDownWindow}
      on:toggle_floating={onToggleFloating}
    />
  {/each}
</div>
