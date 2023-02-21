<script context="module" lang="ts">
  export type TransformViewportProps = {
    vx: number;
    vy: number;
    vzxLevel: number;
    vzyLevel: number;
    vzx: number;
    vzy: number;
    snap: [number, number];
    vw: number;
    vh: number;
  };
</script>

<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let hideOverflow = true;
  export let sameScale = true;
  export let snap: [number, number] = [0, 0];
  export let scrollRate = 1;
  export let scaleRate = 0.25;

  let vx = 0;
  let vy = 0;
  let vzxLevel = 0;
  let vzyLevel = 0;

  let container: HTMLDivElement;
  let vw = 0;
  let vh = 0;

  $: vzx = Math.pow(2, vzxLevel * scaleRate);
  $: vzy = Math.pow(2, vzyLevel * scaleRate);

  function onWheel(e: WheelEvent) {
    e.preventDefault();

    const dir = e.deltaY > 0 ? 1 : -1;
    const hor = e.shiftKey;

    if (e.ctrlKey) {
      if (sameScale) {
        vzxLevel -= dir;
        vzyLevel -= dir;

        return;
      }

      if (hor) {
        vzxLevel -= dir;
      } else {
        vzyLevel -= dir;
      }

      return;
    }

    if (hor) {
      vx += (dir * scrollRate) / vzx;
    } else {
      vy += (dir * scrollRate) / vzy;
    }
  }

  function onResizeWindow() {
    const { width, height } = container.getBoundingClientRect();

    vw = width;
    vh = height;
  }

  onMount(() => onResizeWindow());
  addEventListener("resize", onResizeWindow);
  onDestroy(() => removeEventListener("resize", onResizeWindow));

  let vprops: TransformViewportProps;
  $: vprops = {
    vx,
    vy,
    vzxLevel,
    vzyLevel,
    vzx,
    vzy,
    snap,
    vw,
    vh,
  };
</script>

<div
  class="debug absolute inset-0"
  class:overflow-hidden={hideOverflow}
  on:wheel={onWheel}
  bind:this={container}
>
  <slot {vprops} />
</div>
