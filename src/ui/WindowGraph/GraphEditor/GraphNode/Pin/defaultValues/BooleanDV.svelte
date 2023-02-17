<script lang="ts">
  import type { HandlerCorePin } from "@/core/communication/handlers";
  import { evtsUI } from "@/ui/communication/handlers";

  export let pin: HandlerCorePin;

  function onPointerDown() {
    evtsUI.emit("update_pin_default_value", {
      id: pin.id,
      value: !pin.defaultValue,
    });
  }
</script>

<button
  class="rounded border border-white/20 px-1 text-[0.65em] shadow-xs shadow-black/30 hover:bg-white/5"
  on:pointerdown={onPointerDown}
>
  {pin.defaultValue}
</button>
