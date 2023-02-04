<script lang="ts">
  import { evtsUI } from "@/ui/communication/handlers";
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreTrack,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import Section from "./Section/Section.svelte";

  export let id: number;

  let track: HandlerCoreTrack | null = null;

  //
  async function updateTrack(evt?: { id: number }) {
    if (evt && evt.id !== id) return;

    track = await cmdsCore.request("track", { id }).catch((err) => {
      console.error(err);
      return track;
    });
  }

  updateTrack();

  evtsCore.on("update_track", updateTrack);

  onDestroy(() => {
    evtsCore.unsub("update_track", updateTrack);
  });

  //
  function newSection() {
    evtsUI.emit("create_section", { trackId: id });
  }
</script>

{#if track}
  <li class="debug flex">
    <div class="debug relative h-16 w-36 p-1">
      <span class="text-sm">{track.name}</span>
      <button class="absolute right-2" on:click={newSection}>➕</button>
    </div>
    <div class="debug relative flex-1">
      {#each track.sectionIds as id}
        <Section {id} />
      {/each}
    </div>
  </li>
{/if}
