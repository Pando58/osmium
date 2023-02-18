<script lang="ts">
  import type { PinDataType } from "@/core/classes/pinDataTypes/pinDataTypes";
  import type { HandlerCorePin } from "@/core/communication/handlers";
  import { getContext, type ComponentType } from "svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../../GraphEditor.svelte";
  import BooleanDV from "./defaultValues/BooleanDV.svelte";
  import IntegerDV from "./defaultValues/IntegerDV.svelte";
  import NoteSequenceDV from "./defaultValues/NoteSequenceDV.svelte";
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

  //
  const dvComponents: Record<PinDataType, ComponentType | null> = {
    execution: null,
    boolean: BooleanDV,
    integer: IntegerDV,
    noteEvents: null,
    noteSequence: NoteSequenceDV,
  };
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
    {#if pin.ioType === "input" && dvComponents[pin.dataType] !== null}
      <svelte:component this={dvComponents[pin.dataType]} {pin} />
    {/if}
    <div class="w-[2em]" />
  </div>
{/if}
