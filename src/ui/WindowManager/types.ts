export interface SecWindow {
  floating: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  tabs: Map<
    number,
    {
      name: string;
      component: ConstructorOfATypedSvelteComponent;
    }
  >;
}
