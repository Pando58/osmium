<script lang="ts">
  import type { NoteSequence } from "@/core/classes/pinDataTypes/pinDataTypes";
  import type { HandlerCorePin } from "@/core/communication/handlers";
  import { appKey, type AppContext } from "@/ui/appContext";
  import { evtsUI } from "@/ui/communication/handlers";
  import WindowEditNoteSequence from "@/ui/WindowEditNoteSequence/WindowEditNoteSequence.svelte";
  import { getContext } from "svelte";

  export let pin: HandlerCorePin;

  const { createWindow } = getContext<AppContext>(appKey);

  function onPointerDown() {
    createWindow({
      floating: true,
      pos: "center",
      w: 400,
      h: 600,
      tabs: [
        {
          component: WindowEditNoteSequence,
          data: {
            sequence: structuredClone(pin.defaultValue),
            onUpdate: (notes: NoteSequence) => {
              evtsUI.emit("update_pin_default_value", {
                id: pin.id,
                value: notes,
              });
            },
          },
        },
      ],
    });
  }
</script>

<button
  class="rounded border border-white/20 px-1 text-[0.65em] shadow-xs shadow-black/30 hover:bg-white/5"
  on:pointerdown={onPointerDown}
>
  Edit
</button>
