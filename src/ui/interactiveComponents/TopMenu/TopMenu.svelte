<script lang="ts">
  import Entry from "./Entry.svelte";

  export let absolute = false;
  export let entries: {
    label: string;
    menuItems: { text: string; fn: () => void }[];
  }[];
</script>

<ul
  class="flex h-6 items-stretch bg-black/10 px-2 text-xs"
  class:absolute
  class:inset-x-0={absolute}
>
  {#each entries as { label, menuItems }}
    <Entry {label} {menuItems} />
  {/each}
</ul>
