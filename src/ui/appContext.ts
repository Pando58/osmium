export const appKey = Symbol();

export type WindowConfig = {
  floating: boolean;
  pos: [number, number] | "center";
  w: number;
  h: number;
  tabs: { name: string; component: ConstructorOfATypedSvelteComponent }[];
};

export interface AppContext {
  onCreateWindow(handler: (winConfig: WindowConfig) => void): void;
  createWindow(winConfig: WindowConfig): void;
}
