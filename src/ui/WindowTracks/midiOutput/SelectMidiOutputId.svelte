<script lang="ts">
  import type { HandlerCoreTrack } from "@/core/communication/handlers";
  import {
    cmdsPlayer,
    evtsPlayer,
    type HandlerPlayerMidiOutput,
  } from "@/player/communication/handlers";
  import { onDestroy } from "svelte";
  import { evtsUI } from "../../communication/handlers";
  import SelectWithButtons from "../../interactiveComponents/SelectWithButtons.svelte";

  export let track: HandlerCoreTrack;

  //
  let midiPorts: HandlerPlayerMidiOutput[] = [];

  async function updateMidiPorts() {
    midiPorts = await cmdsPlayer.request("midi_outputs", null).catch((err) => {
      console.error(err);
      return midiPorts;
    });
  }

  updateMidiPorts();

  evtsPlayer.on("update_midi_outputs", updateMidiPorts);

  onDestroy(() => {
    evtsPlayer.unsub("update_midi_outputs", updateMidiPorts);
  });
</script>

<SelectWithButtons>
  <select
    bind:value={track.midiOutputId}
    name=""
    id=""
    on:change={() => {
      evtsUI.emit("update_track_midi_output_id", {
        id: track.id,
        outputId: track.midiOutputId,
      });
    }}
  >
    <option selected value={null} />
    {#each midiPorts as port}
      <option value={port.id}>{port.name}</option>
    {/each}
  </select>
</SelectWithButtons>
