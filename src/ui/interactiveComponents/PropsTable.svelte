<div class="table border-spacing-1.5 text-xs" data-container>
  <slot />
</div>

<style>
  [data-container] > :global(*) {
    @apply table-row;
  }

  [data-container] > :global(*) > :global(*) {
    @apply table-cell;
  }

  [data-container] > :global(*) > :global(span:nth-child(1)) {
    @apply w-0 whitespace-nowrap pr-1;
  }

  [data-container] > :global(*) > :global(*:nth-child(2)) {
    @apply w-full;
  }
</style>
