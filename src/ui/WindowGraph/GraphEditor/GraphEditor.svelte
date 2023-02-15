<script context="module" lang="ts">
  export const graphEditorKey = Symbol();

  export interface GraphEditorContext {
    registerPinPair(a: number, b: number): void;
    clearPinPair(a: number, b: number): void;
    registerSvg(id: number, svg: SVGElement): void;
    clearSvg(id: number): void;
    setPressPinId(id: number): void;
    setReleasePinId(id: number): void;
    selectNode(id: number): void;
    getSelectedNodeId(): Writable<number>;
  }
</script>

<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreGraph,
  } from "@/core/communication/handlers";
  import { evtsUI } from "@/ui/communication/handlers";
  import type { UIAddNodes } from "@/core/classes/nodes/factory/nodeFactories";
  import TopMenu from "@/ui/interactiveComponents/TopMenu/TopMenu.svelte";
  import { onDestroy, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import GraphNode from "./GraphNode/GraphNode.svelte";
  import SvgLines from "./SvgLines/SvgLines.svelte";

  export let graphId: number | null;

  let graph: HandlerCoreGraph | null = null;

  let editorContainer: HTMLDivElement;

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
    registerPinPair(a, b) {
      const index = pinPairs.findIndex(
        ([u, v]) => (a === u && b === v) || (a === v && b === u)
      );

      if (index > -1) pinPairs.splice(index, 1);

      pinPairs = [...pinPairs, [a, b]];
    },
    clearPinPair(a, b) {
      const index = pinPairs.findIndex(
        ([u, v]) => (a === u && b === v) || (a === v && b === u)
      );

      if (index > -1) pinPairs.splice(index, 1);

      pinPairs = pinPairs;
    },
    registerSvg(id, svg) {
      svgs.set(id, svg);

      svgs = svgs;
    },
    clearSvg(id) {
      svgs.delete(id);

      svgs = svgs;
    },
    setPressPinId(id) {
      pressPinId = id;
    },
    setReleasePinId(id) {
      releasePinId = id;
    },
    selectNode(id) {
      $selectedNodeId = id;
    },
    getSelectedNodeId() {
      return selectedNodeId;
    },
  });

  //
  let pressPinId: number | null = null;
  let releasePinId: number | null = null;

  function pinReleasePointer() {
    if (pressPinId !== null && releasePinId !== null) {
      evtsUI.emit("connect_pins", { id1: pressPinId, id2: releasePinId });
    }

    pressPinId = null;
    releasePinId = null;
  }

  addEventListener("pointerup", pinReleasePointer);

  onDestroy(() => {
    removeEventListener("pointerup", pinReleasePointer);
  });

  //
  let selectedNodeId = writable(-1);

  function unselectNode(e: PointerEvent) {
    if (
      e.target instanceof Element &&
      !e.target.hasAttribute("data-target-unselect-nodes")
    )
      return;

    $selectedNodeId = -1;
  }

  //
  const addMenuNodes: { type: UIAddNodes; name: string }[] = [
    {
      type: "TestNode",
      name: "Test Node",
    },
  ];

  $: addMenuItems = addMenuNodes.map(({ type, name }) => ({
    text: name,
    fn: () => {
      if (graphId === null) return;

      evtsUI.emit("create_node", { graphId, type, x: 2, y: 2 });
    },
  }));

  $: menuEntries = [
    {
      label: "Add node",
      menuItems: addMenuItems,
    },
    {
      label: "Edit",
      menuItems: [
        {
          text: "Delete node",
          fn: () => {
            evtsUI.emit("delete_node", { id: $selectedNodeId });
            $selectedNodeId = -1;
          },
        },
      ],
    },
  ];
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
  bind:this={editorContainer}
  on:pointerdown={unselectNode}
>
  <div class="absolute h-[400%] w-[400%]">
    {#if graph}
      <SvgLines {pinPairs} {svgs} nodeIds={graph.nodeIds} {pressPinId} />
      {#each graph.nodeIds as id}
        <GraphNode {id} {editorContainer} />
      {/each}
      <TopMenu entries={menuEntries} absolute={true} />
    {/if}
  </div>
</div>
