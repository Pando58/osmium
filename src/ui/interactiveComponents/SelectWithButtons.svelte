<div class="flex">
  <slot />
</div>

<style>
  div > :global(select) {
    @apply min-w-0 flex-1 truncate border border-zinc-700 bg-zinc-850 p-0.5 pt-0 text-xs;
  }

  div > :global(button) {
    @apply h-6 w-6 border border-zinc-750/70 bg-zinc-650;
  }

  div > :global(*) {
    @apply shadow-xs shadow-black/30;
  }

  div > :global(*):not(:first-child) {
    @apply border-l-0;
  }

  div > :global(*):first-child {
    @apply rounded-l;
  }

  div > :global(*):last-child {
    @apply rounded-r;
  }
</style>
