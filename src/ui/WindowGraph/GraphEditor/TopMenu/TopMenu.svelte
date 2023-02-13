<script lang="ts">
  import { getContext } from "svelte";
  import Entry from "./Entry.svelte";
  import {
    graphEditorKey,
    type GraphEditorContext,
  } from "../GraphEditor.svelte";
  import { evtsUI } from "@/ui/communication/handlers";

  const { getSelectedNodeId } = getContext<GraphEditorContext>(graphEditorKey);

  const selectedNodeId = getSelectedNodeId();
</script>

<ul class="absolute inset-x-0 flex h-6 items-stretch bg-black/10 px-2 text-xs">
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
