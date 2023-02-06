<script lang="ts">
  import GraphEditor from "./GraphEditor/GraphEditor.svelte";
  import GraphSelect from "./GraphSelect/GraphSelect.svelte";

  export let winName: string;
  winName = "Graph editor";

  let currentGraphId: number | null = null;
</script>

<div class="absolute inset-0">
  <div class="flex h-full">
    <div class="mt-1 flex-1">
      <GraphEditor graphId={currentGraphId} />
    </div>
    <div class="w-52">
      <GraphSelect bind:selectedId={currentGraphId} />
    </div>
  </div>
</div>
