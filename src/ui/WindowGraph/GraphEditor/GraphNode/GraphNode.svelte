<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreNode,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import Pin from "./Pin/Pin.svelte";

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
      class="rounded-t-md border border-black/40 bg-zinc-800 shadow-md shadow-black/30"
      style:padding="0.1em 0.3em"
    >
      <div style:font-size="0.65em">{node.name}</div>
    </div>
    <div
      class="min-h-[4rem] rounded-b-lg border border-t-0 border-black/60 bg-zinc-750 shadow-md shadow-black/30"
    >
      {#each node.pinIds as pinId}
        <Pin id={pinId} nodeId={id} />
      {/each}
    </div>
  </div>
{/if}
