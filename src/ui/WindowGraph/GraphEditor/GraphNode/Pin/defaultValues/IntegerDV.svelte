<script lang="ts">
  import type { HandlerCorePin } from "@/core/communication/handlers";
  import { evtsUI } from "@/ui/communication/handlers";

  export let pin: HandlerCorePin;

  function onChange() {
    evtsUI.emit("update_pin_default_value", {
      id: pin.id,
      value: Math.floor(pin.defaultValue as number),
    });
  }
</script>

<input
  class="w-12 rounded border border-white/20 bg-transparent pl-1 text-[0.65em]"
  type="number"
  bind:value={pin.defaultValue}
  on:change={onChange}
  name=""
  id=""
/>
