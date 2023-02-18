<script lang="ts">
  import {
    noteEventNames,
    noteSequenceSchema,
    type NoteEvent,
  } from "@/core/classes/pinDataTypes/pinDataTypes";
  import { z } from "zod";
  import InputNumber from "../interactiveComponents/InputNumber.svelte";
  import PropsTable from "../interactiveComponents/PropsTable.svelte";

  export let winName: string;
  winName = "Edit Note Sequence";

  export let winData;

  const winDataSchema = z.object({
    sequence: noteSequenceSchema,
    onUpdate: z.function().args(noteSequenceSchema),
  });

  const parse = winDataSchema.safeParse(winData);

  let length = parse.success ? parse.data.sequence.length : 0;
  let notes = parse.success ? parse.data.sequence.notes : [];

  let eventSelect: HTMLSelectElement;

  function eventSelectChange() {
    const evType = eventSelect.value as NoteEvent["type"];

    const newEvent: NoteEvent =
      evType === "note_on"
        ? { type: "note_on", pitch: 0, velocity: 127 }
        : evType === "note_off"
        ? { type: "note_off", pitch: 0 }
        : { type: "all_notes_off" };

    notes.push({
      ...newEvent,
      position: notes[notes.length - 1]?.position + 1 || 0,
    });
    updateNotes();

    eventSelect.value = "";
  }

  function removeNoteEvent(index: number) {
    notes = notes.filter((_, i) => i !== index);
  }

  function updateNotes() {
    notes = notes.sort((a, b) => {
      const positionDifference = a.position - b.position;

      if (positionDifference !== 0) return positionDifference;

      return (
        noteEventNames.findIndex((t) => t === a.type) -
        noteEventNames.findIndex((t) => t === b.type)
      );
    });
  }

  function applyChanges() {
    if (!parse.success) return;

    parse.data.onUpdate({ length, notes });
  }
</script>

<div class="absolute inset-0">
  <div class="flex h-full flex-col p-2">
    {#if parse.success}
      <PropsTable>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Length:</span>
          <InputNumber
            step={1}
            min={0}
            bind:value={length}
            class_="max-w-[6rem]"
          />
        </label>
      </PropsTable>
      <div class="mt-2 mb-0.5 flex-1 overflow-auto">
        <table class="w-full text-xs">
          <thead class="bg-zinc-750">
            <tr>
              <th class="w-5/12">Type</th>
              <th class="w-3/12">Position</th>
              <th class="w-2/12">Note</th>
              <th class="w-2/12">Velocity</th>
            </tr>
          </thead>
          <tbody class="bg-zinc-850">
            {#each notes as noteEvent, i}
              <tr>
                <td>
                  <div class="flex justify-between">
                    <span>{noteEvent.type}</span>
                    <button
                      class="font-bold text-red-200"
                      on:click={() => removeNoteEvent(i)}>x</button
                    >
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    class="w-full bg-transparent outline-none"
                    bind:value={noteEvent.position}
                    min="0"
                    step="1"
                    on:change={() => {
                      noteEvent.position = Math.max(
                        0,
                        Math.floor(noteEvent.position)
                      );

                      updateNotes();
                    }}
                  />
                </td>
                {#if noteEvent.type === "note_on" || noteEvent.type === "note_off"}
                  <td>
                    <input
                      type="number"
                      class="w-full bg-transparent outline-none"
                      bind:value={noteEvent.pitch}
                      min="0"
                      max="127"
                      step="1"
                      on:change={() => {
                        if (!("pitch" in noteEvent)) return;

                        noteEvent.pitch = Math.max(
                          0,
                          Math.min(127, Math.floor(noteEvent.pitch))
                        );
                      }}
                    />
                  </td>
                {/if}
                {#if noteEvent.type === "note_on"}
                  <td>
                    <input
                      type="number"
                      class="w-full bg-transparent outline-none"
                      bind:value={noteEvent.velocity}
                      min="0"
                      max="127"
                      step="1"
                      on:change={() => {
                        if (!("velocity" in noteEvent)) return;

                        noteEvent.velocity = Math.max(
                          0,
                          Math.min(127, Math.floor(noteEvent.velocity))
                        );
                      }}
                    />
                  </td>
                {/if}
                {#if noteEvent.type === "note_off"}
                  <td />
                {/if}
                {#if noteEvent.type === "all_notes_off"}
                  <td />
                  <td />
                {/if}
              </tr>
            {/each}
            <tr>
              <td>
                <select
                  class="w-full bg-transparent outline-none"
                  bind:this={eventSelect}
                  on:change={eventSelectChange}
                  name=""
                  id=""
                >
                  <option disabled hidden selected value="" />
                  {#each noteEventNames as eventName}
                    <option class="bg-zinc-850 p-4" value={eventName}>
                      {eventName}
                    </option>
                  {/each}
                </select>
              </td>
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <button
        class="mt-2 ml-auto rounded border border-zinc-700 py-1 px-2 text-xs shadow-xs shadow-black/30 hover:bg-white/5"
        on:click={applyChanges}
      >
        Apply
      </button>
    {/if}
  </div>
</div>

<style>
  table,
  th,
  td {
    @apply border border-zinc-650;
  }

  td,
  th {
    @apply p-2;
  }
</style>
