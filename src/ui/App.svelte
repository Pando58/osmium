<script lang="ts">
  import { setContext } from "svelte";
  import { appKey, type AppContext, type WindowConfig } from "./appContext";
  import WindowManager from "./WindowManager/WindowManager.svelte";

  let createWindowHandler = (_: WindowConfig) => {};

  setContext<AppContext>(appKey, {
    onCreateWindow(handler: (winConfig: WindowConfig) => void) {
      createWindowHandler = handler;
    },
    createWindow(winConfig: WindowConfig) {
      createWindowHandler(winConfig);
    },
  });
</script>

<main class="h-screen w-screen bg-neutral-900 text-white">
  <WindowManager />
</main>
