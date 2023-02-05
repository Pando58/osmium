import type { ComponentType, SvelteComponentTyped } from "svelte";

export const appKey = Symbol();

export type WindowConfig = {
  floating: boolean;
  pos: [number, number] | "center";
  w: number;
  h: number;
  tabs: {
    component: ComponentType<SvelteComponentTyped>;
    data?: Record<string, any>;
  }[];
};

export interface AppContext {
  onCreateWindow(handler: (winConfig: WindowConfig) => void): void;
  createWindow(winConfig: WindowConfig): void;
}
