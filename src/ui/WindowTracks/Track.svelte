<script lang="ts">
  import { evtsUI } from "@/ui/communication/handlers";
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreTrack,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import Section from "./Section/Section.svelte";
  import SelectMidiOutputId from "./midiOutput/SelectMidiOutputId.svelte";
  import SelectMidiOutputChannel from "./midiOutput/SelectMidiOutputChannel.svelte";
  import type { TransformViewportProps } from "../TransformViewport/TransformViewport.svelte";

  export let id: number;
  export let vprops: TransformViewportProps;

  let track: HandlerCoreTrack | null = null;

  //
  async function updateTrack(evt?: { id: number }) {
    if (evt && evt.id !== id) return;

    track = await cmdsCore.request("track", { id }).catch((err) => {
      console.error(err);
      return track;
    });
  }

  $: {
    id;
    updateTrack();
  }

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
    <div class="debug w-36 overflow-hidden py-1 px-2">
      <span class="text-sm">{track.name}</span>
      <button class="absolute right-2" on:click={newSection}>➕</button>
      <div class="mt-4 py-1">
        <span class="block text-xs">Output</span>
        <SelectMidiOutputId {track} />
      </div>
      <div class="py-1">
        <span class="block text-xs">Channel</span>
        <SelectMidiOutputChannel {track} />
      </div>
    </div>
    <div class="debug relative flex-1">
      {#each track.sectionIds as id}
        <Section {id} {vprops} />
      {/each}
    </div>
  </li>
{/if}
