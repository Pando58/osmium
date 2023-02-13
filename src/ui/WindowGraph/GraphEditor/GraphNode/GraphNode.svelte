<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreNode,
  } from "@/core/communication/handlers";
  import { evtsUI } from "@/ui/communication/handlers";
  import { getContext, onDestroy } from "svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../GraphEditor.svelte";
  import SortPins from "./SortPins.svelte";

  export let id: number;
  export let editorContainer: HTMLDivElement;

  let node: HandlerCoreNode | null = null;

  //
  async function updateNode(evt?: { id: number }) {
    if (evt && evt.id !== id) return;

    node = await cmdsCore.request("node", { id }).catch((err) => {
      console.error(err);
      return node;
    });
  }

  $: {
    id;
    updateNode();
  }

  evtsCore.on("update_node", updateNode);

  onDestroy(() => {
    evtsCore.unsub("update_node", updateNode);
  });

  //
  let nodeContainer: HTMLDivElement;
  let draggingOffset: [number, number] | null = null;

  function onPointerDownTitle(e: PointerEvent) {
    if (e.type === "pointerdown") {
      const { left, top } = nodeContainer.getBoundingClientRect();
      draggingOffset = [e.clientX - left, e.clientY - top];
    } else {
      draggingOffset = null;
    }
  }

  addEventListener("pointerup", onPointerDownTitle);

  function onPointerMove(e: PointerEvent) {
    if (draggingOffset === null) return;

    const { left, top } = editorContainer.getBoundingClientRect();

    evtsUI.emit("move_node", {
      id,
      x: ~~(e.clientX - left - draggingOffset[0]) / 20,
      y: ~~(e.clientY - top - draggingOffset[1]) / 20,
    });
  }

  addEventListener("pointermove", onPointerMove);

  onDestroy(() => {
    removeEventListener("pointermove", onPointerMove);
  });

  //
  const { selectNode, getSelectedNodeId } =
    getContext<GraphEditorContext>(graphEditorKey);

  const selectedNodeId = getSelectedNodeId();

  function onPointerDownNode(e: PointerEvent) {
    if (e.target instanceof Element && e.target.hasAttribute("data-target-pin"))
      return;

    selectNode(id);
  }
</script>

{#if node}
  <div
    class="absolute after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:outline-double after:outline-2 after:outline-white/70"
    class:after:hidden={id !== $selectedNodeId}
    style:left={node.x + "em"}
    style:top={node.y + "em"}
    bind:this={nodeContainer}
    on:pointerdown={onPointerDownNode}
  >
    <div
      class="flex rounded-t-md border border-black/40 bg-zinc-800/90 py-[0.1em] px-[0.3em] shadow-md shadow-black/30"
      on:pointerdown={onPointerDownTitle}
      on:pointerup={onPointerDownTitle}
    >
      <span class="text-[0.65em]">{node.name}</span>
    </div>
    <div
      class="min-h-[2em] rounded-b-lg border border-t-0 border-black/60 bg-zinc-750/90 p-[0.4em] shadow-md shadow-black/30"
    >
      <div class="flex flex-col gap-[0.2em]">
        <SortPins pinIds={node.pinIds} nodeId={id} />
      </div>
    </div>
  </div>
{/if}
