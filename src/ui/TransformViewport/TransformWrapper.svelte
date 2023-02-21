<script lang="ts">
  import type { TransformViewportProps } from "./TransformViewport.svelte";

  export let x: number;
  export let y: number;
  export let vprops: TransformViewportProps;

  $: vx = vprops.vx;
  $: vy = vprops.vy;
  $: vzx = vprops.vzx;
  $: vzy = vprops.vzy;
  $: snap = vprops.snap;
  $: vw = vprops.vw;
  $: vh = vprops.vh;

  $: lx = (x - vx) * vzx + vw * snap[0];
  $: ly = (y - vy) * vzy + vh * snap[1];
  $: lw = vzx;
  $: lh = vzy;
</script>

<slot x={lx} y={ly} w={lw} h={lh} />
