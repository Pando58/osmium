<script lang="ts">
  import { evtsUI } from "@/ui/communication/handlers";
  import { cmdsCore, evtsCore } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import Track from "./Track.svelte";

  export let winName: string; // doesn't work using const
  winName = "Tracks";

  let trackIds: number[] = [];

  //
  async function updateTrackIds() {
    trackIds = await cmdsCore.request("track_ids", null).catch((err) => {
      console.error(err);
      return trackIds;
    });
  }

  updateTrackIds();

  evtsCore.on("update_tracks", updateTrackIds);

  onDestroy(() => {
    evtsCore.unsub("update_tracks", updateTrackIds);
  });

  //
  function newTrack() {
    evtsUI.emit("create_track", null);
  }
</script>

<section class="debug absolute inset-0">
  <ul>
    {#each trackIds as id}
      <Track {id} />
    {/each}
    <li class="debug">
      <div class="debug grid h-16 w-36 place-items-center">
        <button on:click={newTrack}>➕</button>
      </div>
    </li>
  </ul>
</section>
