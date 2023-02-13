<script lang="ts">
  import { pinDataTypeNames } from "@/core/classes/pinDataTypes/pinDataTypes";
  import { cmdsCore, type HandlerCorePin } from "@/core/communication/handlers";
  import { getContext, onDestroy } from "svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../GraphEditor.svelte";
  import Pin from "./Pin/Pin.svelte";

  export let pinIds: number[];
  export let nodeId: number;

  let pins: HandlerCorePin[] = [];

  //
  async function updatePins(evt?: { id: number }) {
    if (evt && evt.id !== nodeId) return;

    const arr: HandlerCorePin[] = [];

    for (const id of pinIds) {
      const pin: HandlerCorePin | null = await cmdsCore
        .request("pin", { id })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (pin) arr.push(pin);
    }

    pins = arr
      .sort(
        (a, b) =>
          pinDataTypeNames.findIndex((i) => i === a.dataType) -
          pinDataTypeNames.findIndex((i) => i === b.dataType)
      )
      .sort((a, b) => (a.ioType === "output" && b.ioType === "input" ? -1 : 1));
  }

  $: {
    pinIds;
    updatePins();
  }

  //
  const { registerPinPair, clearPinPair } =
    getContext<GraphEditorContext>(graphEditorKey);

  let pinPairs: [number, number][] = [];

  $: {
    const pairs: [number, number][] = [];

    for (const pin of pins) {
      if (pin.connectedPinId !== null) pairs.push([pin.id, pin.connectedPinId]);
    }

    for (const [a, b] of pinPairs) {
      clearPinPair(a, b);
    }

    for (const [a, b] of pairs) {
      registerPinPair(a, b);
    }

    pinPairs = pairs;
  }

  onDestroy(() => {
    for (const [a, b] of pinPairs) {
      clearPinPair(a, b);
    }
  });
</script>

{#each [...pins.values()] as pin}
  <Pin {pin} />
{/each}
