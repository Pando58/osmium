<script lang="ts">
  import { evtsCore } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import PathCoords from "./PathCoords.svelte";
  import PathMouse from "./PathMouse.svelte";

  export let pinPairs: [number, number][];
  export let svgs: Map<number, SVGElement>;
  export let nodeIds: number[];

  export let pressPinId: number | null = null;

  let svgPairs: [[number, SVGElement], [number, SVGElement]][] = [];

  let containerSvg: SVGElement;

  let setPressedPinIsOutput: () => Promise<void>;

  $: {
    svgs;
    pinPairs;

    if (containerSvg) {
      updatePaths();
      setPressedPinIsOutput();
    }
  }

  function updatePaths() {
    const pairs: typeof svgPairs = [];

    for (const [a, b] of pinPairs) {
      const svg1 = svgs.get(a);
      const svg2 = svgs.get(b);

      if (!svg1 || !svg2) return;

      pairs.push([
        [a, svg1],
        [b, svg2],
      ]);
    }

    svgPairs = pairs;
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

  //
</script>

<svg
  class="absolute h-full w-full"
  bind:this={containerSvg}
  data-target-unselect-nodes
>
  {#each svgPairs as [svg1, svg2]}
    <PathCoords {svg1} {svg2} {containerSvg} />
  {/each}
  <PathMouse {pressPinId} {svgs} {containerSvg} bind:setPressedPinIsOutput />
</svg>
