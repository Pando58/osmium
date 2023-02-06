<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreGraph,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import GraphNode from "./GraphNode/GraphNode.svelte";

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
  class="relative h-full"
  style:font-size="20px"
  style={`
    background:
      linear-gradient(to right, #0002 2px, transparent 1px),
      linear-gradient(to bottom, #0002 2px, transparent 1px),
      linear-gradient(to right, #0001 2px, transparent 1px),
      linear-gradient(to bottom, #0001 2px, transparent 1px),
      rgb(32, 32, 34);
    background-size:
      5em 5em,
      5em 5em,
      1em 1em,
      1em 1em;
    background-position: 0em 0em;
  `}
>
  {#if graph}
    {#each graph.nodeIds as id}
      <GraphNode {id} />
    {/each}
  {/if}
</div>
