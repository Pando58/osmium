<script lang="ts">
  export let floating: boolean;
  export let tabs: Map<
    number,
    {
      name: string;
      component: ConstructorOfATypedSvelteComponent;
    }
  >;

  let selectedTabId = 0;

  $: selectedTab = tabs.get(selectedTabId);

  let x = 100;
  let y = 60;
  let w = 600;
  let h = 800;
</script>

<section
  class="debug absolute"
  style:left={x + "px"}
  style:top={y + "px"}
  style:width={w + "px"}
  style:height={h + "px"}
>
  <div class="debug absolute inset-0 flex flex-col" class:m-1={!floating}>
    <div class="debug flex h-6 gap-1">
      {#each [...tabs.entries()] as [_tabId, tab]}
        <div class="debug flex items-center px-1">
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
