import type { Writable } from "svelte/store";

export function handleStore<T>(store: Writable<T>) {
  let value: T;

  store.subscribe((v) => (value = v));

  const proxy = new Proxy<{ value: T }>(
    { value: null! },
    {
      get() {
        return value;
      },
      set(_, __, val: T) {
        store.set(val);

        return true;
      },
    }
  );

  return proxy;
}
