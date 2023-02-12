<script lang="ts">
  import { cubicInOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let coords: [number, number, number, number];

  $: [ax, ay, bx, by] = coords;

  $: curve = Math.abs(ax - bx) / 2;

  $: d = `M ${ax},${ay} C ${ax + curve},${ay}, ${bx - curve},${by} ${bx},${by}`;

  const strokeWidth = tweened(2, { duration: 200, easing: cubicInOut });
  const opacity = tweened(0.8, { duration: 200, easing: cubicInOut });

  function hoverPath(e: MouseEvent) {
    strokeWidth.set(e.type === "mouseenter" ? 4 : 2);
    opacity.set(e.type === "mouseenter" ? 1 : 0.8);
  }
</script>

<path
  {d}
  fill="none"
  stroke="#FFF"
  opacity={$opacity}
  stroke-width={$strokeWidth}
/>
<path
  {d}
  fill="none"
  stroke="#0000"
  stroke-width={20}
  on:mouseenter={hoverPath}
  on:mouseleave={hoverPath}
/>
