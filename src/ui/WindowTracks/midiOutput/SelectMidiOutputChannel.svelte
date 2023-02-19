<script lang="ts">
  import type { HandlerCoreTrack } from "@/core/communication/handlers";
  import { evtsUI } from "../../communication/handlers";
  import SelectWithButtons from "../../interactiveComponents/SelectWithButtons.svelte";

  export let track: HandlerCoreTrack;
</script>

<SelectWithButtons>
  <select
    bind:value={track.midiOutputChannel}
    name=""
    id=""
    on:change={() => {
      evtsUI.emit("update_track_midi_output_channel", {
        id: track.id,
        channel: track.midiOutputChannel,
      });
    }}
  >
    {#each { length: 16 } as _, i}
      <option value={i}>{i + 1}</option>
    {/each}
  </select>
</SelectWithButtons>
