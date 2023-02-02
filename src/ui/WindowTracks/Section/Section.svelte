<script lang="ts">
  import type { HandlerCoreSection } from "@/core/communication/handlers";

  export let section: HandlerCoreSection;
</script>

<div
  class="debug absolute inset-y-0"
  style:left={section.start + "px"}
  style:width={section.end - section.start + "px"}
/>
