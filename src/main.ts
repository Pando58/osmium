import "./app.css";
import "./core";
import "./player";
import App from "./ui/App.svelte";

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
