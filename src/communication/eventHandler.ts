type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (data: T) => void;

interface EventHandler<T extends EventMap> {
  on<K extends EventKey<T>>(evt: K, fn: EventReceiver<T[K]>): void;
  unsub<K extends EventKey<T>>(evt: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(evt: K, data: T[K]): void;
}

export function eventHandler<T extends EventMap>(): EventHandler<T> {
  const listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>;
  } = {};

  return {
    on(key, fn) {
      listeners[key] = [...(listeners[key] || []), fn];
    },
    unsub(key, fn) {
      listeners[key] = (listeners[key] || []).filter((i) => i !== fn);
    },
    emit(key, data) {
      for (const fn of listeners[key] || []) {
        fn(data);
      }
    },
  };
}
