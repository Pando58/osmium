<script lang="ts">
  import { cmdsCore, evtsCore } from "@/core/communication/handlers";
  import { evtsUI } from "@/ui/communication/handlers";
  import { onDestroy } from "svelte";
  import GraphSelectOption from "./GraphSelectOption.svelte";

  let graphIds: number[] = [];

  export let selectedId: number | null;

  //
  async function updateGraphIds() {
    graphIds = await cmdsCore.request("graph_ids", null).catch((err) => {
      console.error(err);
      return graphIds;
    });
  }

  updateGraphIds();

  evtsCore.on("update_graphs", updateGraphIds);

  onDestroy(() => {
    evtsCore.unsub("update_graphs", updateGraphIds);
  });
</script>

<div class="flex p-2">
  <select
    class="flex-1 rounded-l border border-zinc-700 bg-zinc-850 p-0.5 text-xs"
    bind:value={selectedId}
    name=""
    id=""
  >
    <option disabled hidden selected value={null} />
    {#each graphIds as graphId}
      <GraphSelectOption {graphId} />
    {/each}
  </select>
  <button
    class="w-6 border border-l-0 border-zinc-700 bg-zinc-600 text-xs font-bold"
    on:click={() => evtsUI.emit("create_graph", null)}
  >
    +
  </button>
  <button
    class="w-6 rounded-r border border-l-0 border-zinc-700 bg-zinc-600 text-xs font-bold"
  >
    x
  </button>
</div>
