<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreGraph,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import { evtsUI } from "../communication/handlers";
  import SelectWithButtons from "../interactiveComponents/SelectWithButtons.svelte";

  export let sectionId: number;

  let graphs: HandlerCoreGraph[] = [];
  let selectedId: number | null;

  async function updateGraphs() {
    const graphIds: number[] = await cmdsCore
      .request("graph_ids", null)
      .catch((err) => {
        console.error(err);
        return graphIds;
      });

    const newGraphs = [];

    for (const graphId of graphIds) {
      const graph = await cmdsCore
        .request("graph", { id: graphId })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (graph) {
        newGraphs.push(graph);
      }
    }

    graphs = newGraphs;
  }

  updateGraphs();

  evtsCore.on("update_graphs", updateGraphs);

  onDestroy(() => {
    evtsCore.unsub("update_graphs", updateGraphs);
  });
</script>

<SelectWithButtons>
  <select
    bind:value={selectedId}
    name=""
    id=""
    on:change={() =>
      evtsUI.emit("update_section_graph", {
        id: sectionId,
        graphId: selectedId,
      })}
  >
    <option selected value={null} />
    {#each graphs as graph}
      <option value={graph.id}>{graph.name}</option>
    {/each}
  </select>
  <button class="text-xs" on:click={() => evtsUI.emit("create_graph", null)}>
    +
  </button>
</SelectWithButtons>
