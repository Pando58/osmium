<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreGraph,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";

  export let graphId: number;

  let graph: HandlerCoreGraph | null = null;

  //
  async function updateGraph(evt?: { id: number }) {
    if (evt && evt.id !== graphId) return;

    graph = await cmdsCore.request("graph", { id: graphId }).catch((err) => {
      console.error(err);
      return graph;
    });
  }

  updateGraph();

  evtsCore.on("update_graph", updateGraph);

  onDestroy(() => {
    evtsCore.unsub("update_graph", updateGraph);
  });
</script>

{#if graph}
  <option value={graph.id}>{graph.name}</option>
{/if}
