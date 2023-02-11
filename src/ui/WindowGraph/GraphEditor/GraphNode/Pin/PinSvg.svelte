<script context="module" lang="ts">
  const pinColors: Record<keyof PinDataTypes | "execution", string> = {
    execution: "#f2f2f2",
    boolean: "#ed3939",
    integer: "#f17d14",
    // note_sequence: "#39ed87",
    // note_events: "#8ded39",
    // data_sequence: "#b367f2",
  };
</script>

<script lang="ts">
  import type { PinDataTypes } from "@/core/classes/pinDataTypes/pinDataTypes";

  export let dataType: keyof PinDataTypes | "execution";
</script>

<svg viewBox="0 0 24 24" class="h-[0.7em] w-[0.7em]">
  {#if dataType === "execution"}
    <!-- {#if connected} -->
    <polygon points="3.215,0 24,12 3.215,24" fill={pinColors[dataType]} />
    <!-- {:else}
      <mask id="outline-mask-execution">
        <rect x="-2" y="-2" width="28" height="28" fill="white" />
        <polygon points="6.215,5.196 18,12 6.215,18.804" fill="black" />
      </mask>
      <polygon
        points="3.215,0 24,12 3.215,24"
        fill={pinColors[dataType]}
        opacity="0.6"
        mask="url(#outline-mask-execution)"
      />
    {/if} -->
  {:else}
    <mask id="outline-mask">
      <rect x="-2" y="-2" width="28" height="28" fill="white" />
      <circle cx="12" cy="12" r="9" fill="black" />
    </mask>
    <circle
      cx="12"
      cy="12"
      r="12"
      fill={pinColors[dataType]}
      mask="url(#outline-mask)"
    />
    <!-- {#if connected} -->
    <circle cx="12" cy="12" r="6" fill={pinColors[dataType]} />
    <!-- {/if} -->
  {/if}
</svg>
