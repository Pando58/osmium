<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreNode,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import SortPins from "./SortPins.svelte";

  export let id: number;

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
</script>

{#if node}
  <div class="absolute" style:left={node.x + "em"} style:top={node.y + "em"}>
    <div
      class="flex rounded-t-md border border-black/40 bg-zinc-800 py-[0.1em] px-[0.3em] shadow-md shadow-black/30"
    >
      <span class="text-[0.65em]">{node.name}</span>
    </div>
    <div
      class="min-h-[2em] rounded-b-lg border border-t-0 border-black/60 bg-zinc-750 p-[0.4em] shadow-md shadow-black/30"
    >
      <div class="flex flex-col gap-[0.2em]">
        <SortPins pinIds={node.pinIds} nodeId={id} />
      </div>
    </div>
  </div>
{/if}
