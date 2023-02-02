<script lang="ts">
  import { evtsUI } from "@/ui/communication/handlers";
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreTrack,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import Track from "./Track.svelte";

  let tracks: HandlerCoreTrack[] = [];

  //
  async function updateTracks() {
    tracks = await cmdsCore.request("tracks", null).catch((err) => {
      console.error(err);
      return tracks;
    });
  }

  updateTracks();

  const onUpdateTracks = () => updateTracks();

  evtsCore.on("update_tracks", onUpdateTracks);

  onDestroy(() => {
    evtsCore.unsub("update_tracks", onUpdateTracks);
  });

  //
  function newTrack() {
    evtsUI.emit("create_track", null);
  }
</script>

<section class="debug absolute inset-0">
  <ul>
    {#each tracks as track}
      <Track {track} />
    {/each}
    <li class="debug">
      <div class="debug grid h-16 w-36 place-items-center">
        <button on:click={newTrack}>➕</button>
      </div>
    </li>
  </ul>
</section>
