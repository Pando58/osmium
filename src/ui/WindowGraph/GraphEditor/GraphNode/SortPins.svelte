<script lang="ts">
  import { pinDataTypeNames } from "@/core/classes/pinDataTypes/pinDataTypes";
  import {
    cmdsCore,
    evtsCore,
    type HandlerCorePin,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
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

  evtsCore.on("update_node", updatePins);

  onDestroy(() => {
    evtsCore.unsub("update_node", updatePins);
  });
</script>

{#each [...pins.values()] as pin}
  <Pin {pin} />
{/each}
