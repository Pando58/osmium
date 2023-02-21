<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreSection,
  } from "@/core/communication/handlers";
  import { appKey, type AppContext } from "@/ui/appContext";
  import { evtsUI } from "@/ui/communication/handlers";
  import TransformResizableDiv from "@/ui/ResizableDiv/TransformResizableDiv.svelte";
  import type { TransformViewportProps } from "@/ui/TransformViewport/TransformViewport.svelte";
  import WindowSectionEditMenu from "@/ui/WindowSectionEditMenu/WindowSectionEditMenu.svelte";
  import { getContext, onDestroy } from "svelte";

  export let id: number;
  export let vprops: TransformViewportProps;

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

  //
  function resize({
    detail,
  }: CustomEvent<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>) {
    if (!section) return;

    evtsUI.emit("update_section", {
      sectionId: id,
      props: {
        position: detail.x,
        length: detail.w,
      },
    });
  }
</script>

{#if section}
  <TransformResizableDiv
    class_="inset-y-0"
    x={section.position}
    w={section.length}
    minW={1}
    ignoreY
    {vprops}
    on:update={resize}
  >
    <div
      class="absolute inset-0 overflow-hidden rounded border-2 border-cyan-400 bg-cyan-600"
    >
      <span class="mt-1 ml-1.5 truncate text-xs font-semibold text-black/50">
        Section {section.id}
      </span>
    </div>
    <div class="absolute inset-0" data-drag on:dblclick={openEditMenu} />
  </TransformResizableDiv>
{/if}
