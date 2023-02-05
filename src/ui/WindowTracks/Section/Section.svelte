<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreSection,
  } from "@/core/communication/handlers";
  import { appKey, type AppContext } from "@/ui/appContext";
  import WindowSectionEditMenu from "@/ui/WindowSectionEditMenu/WindowSectionEditMenu.svelte";
  import { getContext, onDestroy } from "svelte";

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

  evtsCore.on("update_section", updateSection);

  onDestroy(() => {
    evtsCore.unsub("update_section", updateSection);
  });

  //

  const { createWindow } = getContext<AppContext>(appKey);

  function openEditMenu() {
    createWindow({
      floating: true,
      pos: "center",
      w: 200,
      h: 300,
      tabs: [
        {
          component: WindowSectionEditMenu,
          data: {
            sectionId: id,
          },
        },
      ],
    });
  }
</script>

{#if section}
  <div
    class="debug absolute inset-y-0"
    style:left={section.position + "px"}
    style:width={section.length + "px"}
    on:dblclick={openEditMenu}
  />
{/if}
