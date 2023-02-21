<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TransformViewportProps } from "../TransformViewport/TransformViewport.svelte";
  import ResizableDiv from "./ResizableDiv.svelte";

  export let vprops: TransformViewportProps;
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
  export let class_ = "";

  $: vx = vprops.vx;
  $: vy = vprops.vy;
  $: vzx = vprops.vzx;
  $: vzy = vprops.vzy;
  $: snap = vprops.snap;
  $: vw = vprops.vw;
  $: vh = vprops.vh;

  $: tx = (x - vx) * vzx + vw * snap[0];
  $: ty = (y - vy) * vzy + vh * snap[1];
  $: tw = w * vzx;
  $: th = h * vzy;

  function transformToNormalX(n: number) {
    let val = Math.max(0, Math.round((-n - vx * vzx + vw * snap[0]) / -vzx));
    val = (val - vx) * vzx + vw * snap[0];

    return val;
  }

  function transformToNormalY(n: number) {
    let val = Math.max(0, Math.round((-n - vy * vzy + vh * snap[1]) / -vzy));
    val = (val - vy) * vzy + vh * snap[1];

    return val;
  }

  function transformToNormalW(n: number) {
    let val = Math.max(1, Math.round(n / vzx));
    val = val * vzx;

    return val;
  }

  function transformToNormalH(n: number) {
    let val = Math.max(1, Math.round(n / vzy));
    val = val * vzy;

    return val;
  }

  const dispatch = createEventDispatcher();

  function onUpdate({
    detail: e,
  }: CustomEvent<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>) {
    dispatch("update", {
      x: Math.round((-e.x - vx * vzx + vw * snap[0]) / -vzx),
      y: Math.round((-e.y - vy * vzy + vh * snap[1]) / -vzy),
      w: Math.round(e.w / vzx),
      h: Math.round(e.h / vzy),
    });
  }
</script>

<ResizableDiv
  x={tx}
  y={ty}
  w={tw}
  h={th}
  {minW}
  {minH}
  {lockX}
  {lockY}
  {ignoreX}
  {ignoreY}
  {class_}
  transformX={transformToNormalX}
  transformY={transformToNormalY}
  transformW={transformToNormalW}
  transformH={transformToNormalH}
  on:update={onUpdate}
>
  <slot />
</ResizableDiv>
