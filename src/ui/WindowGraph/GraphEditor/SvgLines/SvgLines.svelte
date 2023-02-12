<script lang="ts">
  import { getElementCenter } from "@/ui/misc/getElementCenter";
  import Path from "./Path.svelte";

  export let pinPairs: [number, number][];
  export let svgs: Map<number, SVGElement>;

  let paths: [number, number, number, number][] = [];

  let containerSvg: SVGElement;

  $: {
    svgs;
    pinPairs;

    if (containerSvg) {
      updatePaths();
    }
  }

  function updatePaths() {
    paths = [];

    for (const [a, b] of pinPairs) {
      const svg1 = svgs.get(a);
      const svg2 = svgs.get(b);

      if (!svg1 || !svg2) continue;

      const { left, top } = containerSvg.getBoundingClientRect();

      const [ax, ay] = getElementCenter(svg1);
      const [bx, by] = getElementCenter(svg2);

      paths.push([ax - left, ay - top, bx - left, by - top]);
    }
  }
</script>

<svg class="absolute h-full w-full" bind:this={containerSvg}>
  {#each paths as coords}
    <Path {coords} />
  {/each}
</svg>
