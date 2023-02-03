<script lang="ts">
  import floating_inactive from "@/assets/windowIcons/floating_inactive.svg";
  import floating_active from "@/assets/windowIcons/floating_active.svg";
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
  class={`${floating ? "absolute" : "relative flex-1"}`}
  style:left={floating ? x + "px" : "auto"}
  style:top={floating ? y + "px" : "auto"}
  style:width={floating ? w + "px" : "auto"}
  style:height={floating ? h + "px" : "auto"}
>
  <div
    class="absolute inset-0 flex flex-col border-black/20 bg-zinc-900 shadow-black/30"
    class:m-0.5={!floating}
    class:border={floating}
    class:shadow-lg={floating}
  >
    <div class="flex h-6 justify-between" on:pointerdown={onPointerDownTabBar}>
      <div class="flex gap-0.5 pl-1 pt-1">
        {#each [...tabs.entries()] as [_tabId, tab]}
          <div
            class="flex items-center bg-zinc-800 px-1"
            on:pointerdown={onPointerDownTab}
          >
            <span class="text-xs">{tab.name}</span>
          </div>
        {/each}
      </div>
      <button
        class="relative m-1 grid w-4 place-items-center"
        on:click={toggleFloating}
      >
        <img
          src={floating ? floating_active : floating_inactive}
          class="w-2"
          alt="floating active"
        />
      </button>
    </div>
    <div class="relative flex-1 bg-zinc-800">
      {#if selectedTab}
        <div class="absolute inset-2">
          <svelte:component this={selectedTab.component} />
        </div>
      {/if}
    </div>
  </div>
</section>
