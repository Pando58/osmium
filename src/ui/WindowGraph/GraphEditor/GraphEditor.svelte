<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreGraph,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";

  export let graphId: number | null;

  let graph: HandlerCoreGraph | null = null;

  //
  async function updateGraph(evt?: { id: number }) {
    if (graphId === null) {
      graph = null;
      return;
    }

    if (evt && evt.id !== graphId) return;

    graph = await cmdsCore.request("graph", { id: graphId }).catch((err) => {
      console.error(err);
      return graph;
    });
  }

  updateGraph();

  $: {
    graphId;

    updateGraph();
  }

  evtsCore.on("update_graph", updateGraph);

  onDestroy(() => {
    evtsCore.unsub("update_graph", updateGraph);
  });
</script>

<div
  class="h-full"
  style={`
        background:
          linear-gradient(to right, #0002 2px, transparent 1px),
          linear-gradient(to bottom, #0002 2px, transparent 1px),
          linear-gradient(to right, #0001 2px, transparent 1px),
          linear-gradient(to bottom, #0001 2px, transparent 1px),
          rgb(32, 32, 34);
        background-size:
          100px 100px,
          100px 100px,
          20px 20px,
          20px 20px;
        background-position: -10px -10px;
      `}
>
  {#if graph}
    {graph.name}
  {/if}
</div>
