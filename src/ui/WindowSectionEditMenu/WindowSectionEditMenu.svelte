<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreSection,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import { z } from "zod";
  import { evtsUI } from "../communication/handlers";
  import type { EventHandlerMessages } from "../misc/EventHandlerMessages";

  export let winName: string;
  winName = "Section properties";

  export let winData;

  const winDataSchema = z.object({ sectionId: z.number() });
  const winDataParsed = winDataSchema.safeParse(winData);

  const sectionId = winDataParsed.success ? winDataParsed.data.sectionId : -1;

  let section: HandlerCoreSection | null = null;

  //
  async function updateSection(evt?: { id: number }) {
    if (evt && evt.id !== sectionId) return;

    section = await cmdsCore
      .request("section", { id: sectionId })
      .catch((err) => {
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
  function inputChange(
    props: EventHandlerMessages<typeof evtsUI>["update_section"]["props"]
  ) {
    evtsUI.emit("update_section", { sectionId, props });
  }
</script>

{#if section}
  <div class="absolute inset-0">
    <div class="flex justify-center p-2">
      <div class="table border-spacing-1.5 text-xs">
        <label class="table-row">
          <span class="table-cell w-0 pr-1">Position:</span>
          <input
            type="number"
            step="1"
            min="0"
            class="table-cell w-20 rounded border border-zinc-700 bg-zinc-850 py-1 px-1 pl-1.5"
            bind:value={section.position}
            on:change={() => inputChange({ position: section?.position })}
          />
        </label>
        <label class="table-row">
          <span class="table-cell w-0 pr-1">Length:</span>
          <input
            type="number"
            step="1"
            min="0"
            class="table-cell w-20 rounded border border-zinc-700 bg-zinc-850 py-1 px-1 pl-1.5"
            bind:value={section.length}
            on:change={() => inputChange({ length: section?.length })}
          />
        </label>
      </div>
    </div>
  </div>
{/if}
