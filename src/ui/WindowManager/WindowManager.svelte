<script lang="ts">
  import SectionWindow from "../SectionWindow/SectionWindow.svelte";
  import WindowTracks from "../WindowTracks/WindowTracks.svelte";

  interface SecWindow {
    floating: boolean;
    tabs: Map<
      number,
      {
        name: string;
        component: ConstructorOfATypedSvelteComponent;
      }
    >;
  }

  let windows: SecWindow[] = [
    {
      floating: true,
      tabs: new Map([
        [
          0,
          {
            name: "Tracks",
            component: WindowTracks,
          },
        ],
      ]),
    },
  ];
</script>

{#each windows as win}
  <SectionWindow {...win} />
{/each}
