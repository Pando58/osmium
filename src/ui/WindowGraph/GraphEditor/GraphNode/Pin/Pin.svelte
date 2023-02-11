<script lang="ts">
  import type { HandlerCorePin } from "@/core/communication/handlers";
  import PinSvg from "./PinSvg.svelte";

  export let pin: HandlerCorePin;
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
