<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";

  export let x = 0;
  export let y = 0;
  export let w = 20;
  export let h = 20;
  export let minW = 20;
  export let minH = 20;
  export let lockX = false;
  export let lockY = false;
  export let ignoreX = false;
  export let ignoreY = false;
  export let transformX: (n: number) => number = (n) => n;
  export let transformY: (n: number) => number = (n) => n;
  export let transformW: (n: number) => number = (n) => n;
  export let transformH: (n: number) => number = (n) => n;
  export let class_ = "";

  type HandlerName = "n" | "s" | "w" | "e" | "nw" | "ne" | "sw" | "se";

  let activeHandler: HandlerName | null = null;
  let dragging = false;
  let clickMX = 0;
  let clickMY = 0;
  let clickX = 0;
  let clickY = 0;
  let clickW = 0;
  let clickH = 0;

  const dispatch = createEventDispatcher();

  function clickHandler(e: PointerEvent, handler: string) {
    if (e.type === "pointerup") {
      activeHandler = null;
      dragging = false;
      return;
    }

    activeHandler = handler as HandlerName;

    clickX = x;
    clickY = y;
    clickW = w;
    clickH = h;
  }

  function clickMainContainer(e: PointerEvent) {
    if (e.target instanceof Element && e.target.hasAttribute("data-drag")) {
      dragging = true;
    }

    clickMX = e.clientX - x;
    clickMY = e.clientY - y;
  }

  function onPointerMove(e: PointerEvent) {
    if (dragging) {
      if (!lockX) x = transformX(e.clientX - clickMX);
      if (!lockY) y = transformY(e.clientY - clickMY);

      dispatch("update", { x, y, w, h });

      return;
    }

    if (!activeHandler) return;

    if (!lockX) {
      if (
        activeHandler === "w" ||
        activeHandler === "nw" ||
        activeHandler === "sw"
      ) {
        x = transformX(Math.min(clickX + clickW - minW, e.clientX - clickMX));
        w = transformW(Math.max(minW, clickX - e.clientX + clickW + clickMX));
      }

      if (
        activeHandler === "e" ||
        activeHandler === "ne" ||
        activeHandler === "se"
      ) {
        w = transformW(Math.max(minW, e.clientX - clickX + clickW - clickMX));
      }
    }

    if (!lockY) {
      if (
        activeHandler === "n" ||
        activeHandler === "nw" ||
        activeHandler === "ne"
      ) {
        y = transformY(Math.min(clickY + clickH - minH, e.clientY - clickMY));
        h = transformH(Math.max(minH, clickY - e.clientY + clickH + clickMY));
      }

      if (
        activeHandler === "s" ||
        activeHandler === "sw" ||
        activeHandler === "se"
      ) {
        h = transformH(Math.max(minH, e.clientY - clickY + clickH - clickMY));
      }
    }

    dispatch("update", { x, y, w, h });
  }

  addEventListener("pointerup", clickHandler as () => void);
  addEventListener("pointermove", onPointerMove);

  onDestroy(() => {
    removeEventListener("pointerup", clickHandler as () => void);
    removeEventListener("pointermove", onPointerMove);
  });
</script>

<div
  class={"absolute " + class_}
  style:left={!ignoreX ? x + "px" : null}
  style:width={!ignoreX ? w + "px" : null}
  style:top={!ignoreY ? y + "px" : null}
  style:height={!ignoreY ? h + "px" : null}
  on:pointerdown={clickMainContainer}
>
  <slot />

  {#if !lockY && !ignoreY}
    {#each ["n", "s"] as dir}
      <div class={dir} data-edge on:pointerdown={(e) => clickHandler(e, dir)} />
    {/each}
  {/if}
  {#if !lockX && !ignoreX}
    {#each ["w", "e"] as dir}
      <div class={dir} data-edge on:pointerdown={(e) => clickHandler(e, dir)} />
    {/each}
  {/if}

  {#if !lockX && !lockY && !ignoreX && !ignoreY}
    {#each ["n", "s"] as ver}
      {#each ["w", "e"] as hor}
        <div
          class={ver + " " + hor}
          data-corner
          on:pointerdown={(e) => clickHandler(e, ver + hor)}
        />
      {/each}
    {/each}
  {/if}
</div>

<style>
  [data-edge] {
    @apply absolute;
  }

  [data-edge].n,
  [data-edge].s {
    @apply h-2 w-full;
  }

  [data-edge].w,
  [data-edge].e {
    @apply h-full w-2;
  }

  [data-corner] {
    @apply absolute h-2 w-2;
  }

  .n {
    @apply -translate-y-1/2 cursor-n-resize;
  }

  .s {
    @apply bottom-0 translate-y-1/2 cursor-s-resize;
  }

  .w {
    @apply -translate-x-1/2 cursor-w-resize;
  }

  .e {
    @apply right-0 translate-x-1/2 cursor-e-resize;
  }

  .n.w {
    @apply cursor-nw-resize;
  }

  .n.e {
    @apply cursor-ne-resize;
  }

  .s.w {
    @apply cursor-sw-resize;
  }

  .s.e {
    @apply cursor-se-resize;
  }
</style>
