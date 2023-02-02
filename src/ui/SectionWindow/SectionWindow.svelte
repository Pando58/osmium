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
</script>

<section
  class="debug absolute"
  style:left={x + "px"}
  style:top={y + "px"}
  style:width={w + "px"}
  style:height={h + "px"}
>
  <div class="debug absolute inset-0 flex flex-col" class:m-1={!floating}>
    <div class="debug flex h-6 gap-1" on:pointerdown={onPointerDownTabBar}>
      {#each [...tabs.entries()] as [_tabId, tab]}
        <div
          class="debug flex items-center px-1"
          on:pointerdown={onPointerDownTab}
        >
          <span class="text-xs">{tab.name}</span>
        </div>
      {/each}
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
