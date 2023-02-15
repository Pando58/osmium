<script lang="ts">
  import {
    cmdsCore,
    evtsCore,
    type HandlerCoreSection,
  } from "@/core/communication/handlers";
  import { onDestroy } from "svelte";
  import { z } from "zod";
  import { evtsUI } from "../communication/handlers";
  import InputNumber from "../interactiveComponents/InputNumber.svelte";
  import PropsTable from "../interactiveComponents/PropsTable.svelte";
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
      <PropsTable>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Position:</span>
          <InputNumber
            step={1}
            min={0}
            bind:value={section.position}
            on:change={() => inputChange({ position: section?.position })}
          />
        </label>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Length:</span>
          <InputNumber
            step={1}
            min={0}
            bind:value={section.length}
            on:change={() => inputChange({ length: section?.length })}
          />
        </label>
      </PropsTable>
    </div>
  </div>
{/if}
