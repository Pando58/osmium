<script lang="ts">
  import { evtsUI } from "@/ui/communication/handlers";
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreSection,
    type HandlerCoreTrack,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import Section from "./Section/Section.svelte";

  export let track: HandlerCoreTrack;

  let sections: HandlerCoreSection[] = [];

  //
  async function updateSections() {
    sections = await cmdsCore
      .request("sections", { trackId: track.id })
      .catch((err) => {
        console.error(err);
        return sections;
      });
  }

  updateSections();

  const onUpdateSections = () => updateSections();

  evtsCore.on("update_sections", onUpdateSections);

  onDestroy(() => {
    evtsCore.unsub("update_sections", onUpdateSections);
  });

  //
  function newSection() {
    evtsUI.emit("create_section", { trackId: track.id });
  }
</script>

<li class="debug flex">
  <div class="debug relative h-16 w-36 p-1">
    <span class="text-sm">{track.name}</span>
    <button class="absolute right-2" on:click={newSection}>➕</button>
  </div>
  <div class="debug relative flex-1">
    {#each sections as section}
      <Section {section} />
    {/each}
  </div>
</li>
