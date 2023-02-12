<script lang="ts">
  import { evtsCore } from "@/core/communication/handlers";
  import { getElementCenter } from "@/ui/misc/getElementCenter";
  import { onDestroy } from "svelte";
  import Path from "./Path.svelte";

  export let pinPairs: [number, number][];
  export let svgs: Map<number, SVGElement>;
  export let nodeIds: number[];

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

  //
  async function onUpdateNode(evt: { id: number }) {
    if (!nodeIds.includes(evt.id)) return;

    updatePaths();
  }

  evtsCore.on("update_node", onUpdateNode);

  onDestroy(() => {
    evtsCore.unsub("update_node", onUpdateNode);
  });
</script>

<svg class="absolute h-full w-full" bind:this={containerSvg}>
  {#each paths as coords}
    <Path {coords} />
  {/each}
</svg>
