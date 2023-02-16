<script lang="ts">
  import { cmdsCore } from "@/core/communication/handlers";
  import { getElementCenter } from "@/ui/misc/getElementCenter";
  import { onDestroy } from "svelte";
  import Path from "./Path.svelte";

  export let pressPinId: number | null = null;
  export let svgs: Map<number, SVGElement>;
  export let containerSvg: SVGElement;

  let pinDragCoords: [number, number, number, number] = [0, 0, 0, 0];
  let pressedPinIsOutput = true;

  $: {
    pressPinId;
    setPressedPinIsOutput();
  }

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

{#if pressPinId !== null}
  <Path coords={pinDragCoords} noHoverEffect={true} />
{/if}
