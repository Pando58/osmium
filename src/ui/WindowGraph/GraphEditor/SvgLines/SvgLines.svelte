<script lang="ts">
  import { cmdsCore, evtsCore } from "@/core/communication/handlers";
  import { getElementCenter } from "@/ui/misc/getElementCenter";
  import { onDestroy } from "svelte";
  import Path from "./Path.svelte";

  export let pinPairs: [number, number][];
  export let svgs: Map<number, SVGElement>;
  export let nodeIds: number[];

  export let pressPinId: number | null = null;

  let paths: [number, number, number, number][] = [];

  let containerSvg: SVGElement;

  $: {
    svgs;
    pinPairs;

    if (containerSvg) {
      updatePaths();
      setPressedPinIsOutput();
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

  //
  let pinDragCoords: [number, number, number, number] = [0, 0, 0, 0];
  let pressedPinIsOutput = true;

  async function setPressedPinIsOutput() {
    if (pressPinId === null) return;

    const pin = await cmdsCore
      .request("pin", { id: pressPinId })
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (!pin) return;

    pressedPinIsOutput = pin.ioType === "output";
  }

  $: {
    if (pressPinId !== null) {
      const svg = svgs.get(pressPinId);

      if (svg) {
        const { left, top } = containerSvg.getBoundingClientRect();

        const [x, y] = getElementCenter(svg);

        pinDragCoords[pressedPinIsOutput ? 0 : 2] = x - left;
        pinDragCoords[pressedPinIsOutput ? 1 : 3] = y - top;

        pinDragCoords = pinDragCoords;
      }
    }
  }

  function pinDrag(e: PointerEvent) {
    if (pressPinId === null) return;

    const { left, top } = containerSvg.getBoundingClientRect();

    pinDragCoords[pressedPinIsOutput ? 2 : 0] = e.clientX - left;
    pinDragCoords[pressedPinIsOutput ? 3 : 1] = e.clientY - top;

    pinDragCoords = pinDragCoords;
  }

  addEventListener("pointermove", pinDrag);
  addEventListener("pointerdown", pinDrag);

  onDestroy(() => {
    removeEventListener("pointermove", pinDrag);
    removeEventListener("pointerdown", pinDrag);
  });
</script>

<svg
  class="absolute h-full w-full"
  bind:this={containerSvg}
  data-target-unselect-nodes
>
  {#each paths as coords}
    <Path {coords} />
  {/each}
  {#if pressPinId !== null}
    <Path coords={pinDragCoords} />
  {/if}
</svg>
