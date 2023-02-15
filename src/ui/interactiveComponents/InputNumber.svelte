<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value = 0;
  export let step: number | null = null;
  export let min: number | null = null;
  export let max: number | null = null;
  export let class_ = "";

  const dispatch = createEventDispatcher();

  function onChange(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    dispatch("change", e);
  }
</script>

<input
  type="number"
  {step}
  {min}
  {max}
  class={"rounded border border-zinc-700 bg-zinc-850 py-1 px-1 pl-1.5 " +
    class_}
  bind:value
  on:change={onChange}
/>
