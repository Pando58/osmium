import type { ComponentType, SvelteComponentTyped } from "svelte";

export interface SecWindow {
  floating: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  tabs: Map<number, TabProps>;
}

export type TabProps = {
  name: string;
  component: ComponentType<SvelteComponentTyped>;
  data?: Record<string, any>;
};
