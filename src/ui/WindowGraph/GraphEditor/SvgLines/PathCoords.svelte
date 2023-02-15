<script lang="ts">
  import { evtsUI } from "@/ui/communication/handlers";
  import { getElementCenter } from "@/ui/misc/getElementCenter";
  import Path from "./Path.svelte";

  export let svg1: [number, SVGElement];
  export let svg2: [number, SVGElement];
  export let containerSvg: SVGElement;

  let path: [number, number, number, number];

  $: {
    const { left, top } = containerSvg.getBoundingClientRect();

    const [ax, ay] = getElementCenter(svg1[1]);
    const [bx, by] = getElementCenter(svg2[1]);

    path = [ax - left, ay - top, bx - left, by - top];
  }

  function onPointerDown() {
    evtsUI.emit("disconnect_pin", { id: svg1[0] });
    evtsUI.emit("disconnect_pin", { id: svg2[0] });
  }
</script>

<Path coords={path} {onPointerDown} />
