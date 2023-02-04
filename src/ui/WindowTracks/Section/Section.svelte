<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreSection,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";

  export let id: number;

  let section: HandlerCoreSection | null = null;

  //
  async function updateSection(evt?: { id: number }) {
    if (evt && evt.id !== id) return;

    section = await cmdsCore.request("section", { id }).catch((err) => {
      console.error(err);
      return section;
    });
  }

  updateSection();

  evtsCore.on("update_track", updateSection);

  onDestroy(() => {
    evtsCore.unsub("update_track", updateSection);
  });
</script>

{#if section}
  <div
    class="debug absolute inset-y-0"
    style:left={section.start + "px"}
    style:width={section.end - section.start + "px"}
  />
{/if}
