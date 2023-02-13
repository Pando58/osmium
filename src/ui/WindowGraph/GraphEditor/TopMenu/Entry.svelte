<script lang="ts">
  import { onDestroy } from "svelte";

  export let label: string;
  export let menuItems: { text: string; fn: () => void }[];
  let labelElement: HTMLSpanElement;
  let ulMenu: HTMLUListElement;
  let menuActive = false;

  function clickLabel(e: PointerEvent) {
    if (e.target !== labelElement) return;

    menuActive = !menuActive;
  }

  function hideMenu(e: PointerEvent) {
    if (
      e.target === labelElement ||
      (e.target as Element).parentElement === ulMenu
    )
      return;

    menuActive = false;
  }

  addEventListener("pointerdown", hideMenu);

  onDestroy(() => {
    removeEventListener("pointerdown", hideMenu);
  });
</script>

<li
  class="flex cursor-pointer items-center px-2 hover:bg-zinc-500/20"
  on:pointerdown={clickLabel}
>
  <span bind:this={labelElement}>{label}</span>
  {#if menuActive}
    <div class="absolute top-full">
      <ul
        class="rounded border border-zinc-750 bg-zinc-900 shadow shadow-black/30"
        class:w-16={menuItems.length === 0}
        bind:this={ulMenu}
      >
        {#each menuItems as { text, fn }}
          <li
            on:click={() => {
              fn();
              menuActive = false;
            }}
            on:keydown={() => {
              fn();
              menuActive = false;
            }}
          >
            {text}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</li>

<style>
  ul {
    @apply py-1;
  }

  ul li {
    @apply py-1 px-4;
  }

  ul li:hover {
    @apply bg-zinc-800;
  }
</style>
