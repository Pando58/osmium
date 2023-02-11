<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCorePin,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import PinSvg from "./PinSvg.svelte";

  export let id: number;
  export let nodeId: number;

  let pin: HandlerCorePin | null = null;

  //
  async function updatePin(evt?: { id: number }) {
    if (evt && evt.id !== nodeId) return;

    pin = await cmdsCore.request("pin", { id }).catch((err) => {
      console.error(err);
      return pin;
    });
  }

  updatePin();

  evtsCore.on("update_node", updatePin);

  onDestroy(() => {
    evtsCore.unsub("update_node", updatePin);
  });
</script>

{#if pin}
  <div
    class="flex h-[1em] items-center gap-[0.5em]"
    class:flex-row-reverse={pin.ioType === "output"}
  >
    <PinSvg dataType={pin.dataType} />
    <span class="text-[0.65em]">{pin.name}</span>
    <div class="w-[2em]" />
  </div>
{/if}
