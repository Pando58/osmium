<script context="module" lang="ts">
  const pinColors: Record<keyof PinDataTypes | "execution", string> = {
    execution: "#f2f2f2",
    boolean: "#ed3939",
    integer: "#f17d14",
    noteEvents: "#8ded39",
    noteSequence: "#39ed87",
    // data_sequence: "#b367f2",
  };
</script>

<script lang="ts">
  import type { PinDataTypes } from "@/core/classes/pinDataTypes/pinDataTypes";
  import { getContext, onDestroy } from "svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../../GraphEditor.svelte";

  export let id: number;
  export let dataType: keyof PinDataTypes | "execution";
  export let connected: boolean;

  let svg: SVGElement;

  const { registerSvg, clearSvg } =
    getContext<GraphEditorContext>(graphEditorKey);

  let previousId = -1;

  let random = Math.random().toString().substring(2);

  $: {
    if (previousId === -1) previousId = id;

    clearSvg(previousId);
    if (svg) registerSvg(id, svg);

    previousId = id;
  }

  onDestroy(() => {
    clearSvg(previousId);
  });
</script>

<svg
  viewBox="0 0 24 24"
  class="pointer-events-none h-[0.7em] w-[0.7em]"
  bind:this={svg}
>
  {#if dataType === "execution"}
    {#if connected}
      <polygon points="3.215,0 24,12 3.215,24" fill={pinColors[dataType]} />
    {:else}
      <mask id={`outline-mask-exec-${random}`}>
        <rect x="-2" y="-2" width="28" height="28" fill="white" />
        <polygon points="6.215,5.196 18,12 6.215,18.804" fill="black" />
      </mask>
      <polygon
        points="3.215,0 24,12 3.215,24"
        fill={pinColors[dataType]}
        opacity="0.8"
        mask={`url(#outline-mask-exec-${random})`}
      />
    {/if}
  {:else}
    <mask id={`outline-mask-data-${random}`}>
      <rect x="-2" y="-2" width="28" height="28" fill="white" />
      <circle cx="12" cy="12" r="9" fill="black" />
    </mask>
    <circle
      cx="12"
      cy="12"
      r="12"
      fill={pinColors[dataType]}
      opacity="0.8"
      mask={`url(#outline-mask-data-${random})`}
    />
    {#if connected}
      <circle cx="12" cy="12" r="6" fill={pinColors[dataType]} />
    {/if}
  {/if}
</svg>
