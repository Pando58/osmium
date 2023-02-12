<script context="module" lang="ts">
  export const graphEditorKey = Symbol();

  export interface GraphEditorContext {
    registerPinPair(a: number, b: number): void;
    clearPinPair(a: number, b: number): void;
    registerSvg(id: number, svg: SVGElement): void;
    clearSvg(id: number): void;
  }
</script>

<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreGraph,
  } from "@/core/communication/handlers";
  import { onDestroy, setContext } from "svelte";
  import GraphNode from "./GraphNode/GraphNode.svelte";
  import SvgLines from "./SvgLines/SvgLines.svelte";

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

  //
  let svgs: Map<number, SVGElement> = new Map();
  let pinPairs: [number, number][] = [];

  setContext<GraphEditorContext>(graphEditorKey, {
    registerPinPair(a: number, b: number) {
      const index = pinPairs.findIndex(
        ([u, v]) => (a === u && b === v) || (a === v && b === u)
      );

      if (index > -1) pinPairs.splice(index, 1);

      pinPairs = [...pinPairs, [a, b]];
    },
    clearPinPair(a: number, b: number) {
      const index = pinPairs.findIndex(
        ([u, v]) => (a === u && b === v) || (a === v && b === u)
      );

      if (index > -1) pinPairs.splice(index, 1);

      pinPairs = pinPairs;
    },
    registerSvg(id: number, svg: SVGElement) {
      svgs.set(id, svg);

      svgs = svgs;
    },
    clearSvg(id: number) {
      svgs.delete(id);

      svgs = svgs;
    },
  });
</script>

<div
  class="relative h-full overflow-hidden"
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
  <div class="absolute h-[400%] w-[400%]">
    {#if graph}
      <SvgLines {pinPairs} {svgs} />
      {#each graph.nodeIds as id}
        <GraphNode {id} />
      {/each}
    {/if}
  </div>
</div>
