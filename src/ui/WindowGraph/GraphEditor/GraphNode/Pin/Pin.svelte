<script lang="ts">
  import type { HandlerCorePin } from "@/core/communication/handlers";
  import { getContext } from "svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../../GraphEditor.svelte";
  import PinSvg from "./PinSvg.svelte";

  export let pin: HandlerCorePin;

  const { getPinPairs } = getContext<GraphEditorContext>(graphEditorKey);

  const pinPairs = getPinPairs();

  $: connected = $pinPairs.some(([a, b]) => {
    return a === pin.id || b === pin.id;
  });

  const { setPressPinId, setReleasePinId } =
    getContext<GraphEditorContext>(graphEditorKey);

  function onPointerEvent(e: PointerEvent) {
    if (e.type === "pointerdown") {
      setPressPinId(pin.id);
    } else {
      setReleasePinId(pin.id);
    }
  }
</script>

{#if pin}
  <div
    class="flex h-[1em] items-center gap-[0.5em]"
    class:flex-row-reverse={pin.ioType === "output"}
  >
    <div
      on:pointerdown={onPointerEvent}
      on:pointerup={onPointerEvent}
      data-target-pin
    >
      <PinSvg id={pin.id} dataType={pin.dataType} {connected} />
    </div>
    <span class="text-[0.65em]">{pin.name}</span>
    {#if pin.ioType === "input" && pin.dataType !== "execution"}
      <span class="rounded border border-white/20 px-1 text-[0.65em]"
        >{pin.defaultValue}</span
      >
    {/if}
    <div class="w-[2em]" />
  </div>
{/if}
