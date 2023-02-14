<script lang="ts">
  import { getContext } from "svelte";
  import Entry from "./Entry.svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../GraphEditor.svelte";
  import { evtsUI } from "@/ui/communication/handlers";
  import type { UIAddNodes } from "@/core/classes/nodes/factory/nodeFactories";

  export let graphId: number | null;

  const { getSelectedNodeId } = getContext<GraphEditorContext>(graphEditorKey);

  const selectedNodeId = getSelectedNodeId();

  const addMenuNodes: { type: UIAddNodes; name: string }[] = [
    {
      type: "TestNode",
      name: "Test Node",
    },
  ];
</script>

<ul class="absolute inset-x-0 flex h-6 items-stretch bg-black/10 px-2 text-xs">
  <Entry
    label="Add node"
    menuItems={addMenuNodes.map(({ type, name }) => ({
      text: name,
      fn: () => {
        if (graphId === null) return;

        evtsUI.emit("create_node", { graphId, type, x: 2, y: 2 });
      },
    }))}
  />
  <Entry
    label="Edit"
    menuItems={[
      {
        text: "Delete node",
        fn: () => {
          evtsUI.emit("delete_node", { id: $selectedNodeId });
          $selectedNodeId = -1;
        },
      },
    ]}
  />
</ul>
