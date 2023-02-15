<script lang="ts">
  import { cmdsCore, evtsCore } from "@/core/communication/handlers";
  import { evtsUI } from "@/ui/communication/handlers";
  import SelectWithButtons from "@/ui/interactiveComponents/SelectWithButtons.svelte";
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

<div class="p-2">
  <SelectWithButtons>
    <select bind:value={selectedId} name="" id="">
      <option disabled hidden selected value={null} />
      {#each graphIds as graphId}
        <GraphSelectOption {graphId} />
      {/each}
    </select>
    <button class="text-xs" on:click={() => evtsUI.emit("create_graph", null)}>
      +
    </button>
    <button class="text-xs"> - </button>
  </SelectWithButtons>
</div>
