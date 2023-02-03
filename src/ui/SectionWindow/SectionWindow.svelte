<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let id: number;
  export let floating: boolean;
  export let x: number;
  export let y: number;
  export let w: number;
  export let h: number;

  export let tabs: Map<
    number,
    {
      name: string;
      component: ConstructorOfATypedSvelteComponent;
    }
  >;

  let selectedTabId = 0;

  $: selectedTab = tabs.get(selectedTabId);

  //
  const dispatch = createEventDispatcher();

  function onPointerDownTabBar(e: PointerEvent) {
    dispatch("pointerdown_window", {
      windowId: id,
      x: e.clientX - x,
      y: e.clientY - y,
    });
  }

  function onPointerDownTab(e: PointerEvent) {
    e.stopPropagation();
  }

  //
  function toggleFloating() {
    dispatch("toggle_floating", {
      windowId: id,
    });
  }
</script>

<section
  class={`debug ${floating ? "absolute" : "relative flex-1"}`}
  style:left={floating ? x + "px" : "auto"}
  style:top={floating ? y + "px" : "auto"}
  style:width={floating ? w + "px" : "auto"}
  style:height={floating ? h + "px" : "auto"}
>
  <div class="debug absolute inset-0 flex flex-col" class:m-1={!floating}>
    <div
      class="debug flex h-6 justify-between"
      on:pointerdown={onPointerDownTabBar}
    >
      <div class="flex gap-0.5 pl-1 pt-1">
        {#each [...tabs.entries()] as [_tabId, tab]}
          <div
            class="debug flex items-center px-1"
            on:pointerdown={onPointerDownTab}
          >
            <span class="text-xs">{tab.name}</span>
          </div>
        {/each}
      </div>
      <button class="debug relative m-1 w-4" on:click={toggleFloating}>
        <div
          class="absolute inset-0.5 rounded border-2 border-neutral-200"
          class:bg-neutral-200={!floating}
        />
      </button>
    </div>
    <div class="debug relative flex-1">
      {#if selectedTab}
        <div class="debug absolute inset-2">
          <svelte:component this={selectedTab.component} />
        </div>
      {/if}
    </div>
  </div>
</section>
