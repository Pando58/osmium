import type { Result } from "@/misc/Result";

type CommandMap = Record<string, [any, any]>;

type CommandKey<T extends CommandMap> = string & keyof T;
type CommandReceiver<Req, Res> = (data: Req) => Result<Res, string>;

interface CommandHandler<T extends CommandMap> {
  take<K extends CommandKey<T>>(
    cmd: K,
    fn: CommandReceiver<T[K][0], T[K][1]>
  ): void;
  unsub<K extends CommandKey<T>>(
    cmd: K,
    fn: CommandReceiver<T[K][0], T[K][1]>
  ): void;
  request<K extends CommandKey<T>>(cmd: K, data: T[K][0]): Promise<T[K][1]>;
}

export function commandHandler<T extends CommandMap>(): CommandHandler<T> {
  const handlers: {
    [K in keyof T]?: CommandReceiver<T[K][0], T[K][1]>;
  } = {};

  return {
    take(key, fn) {
      if (key in handlers) {
        console.error(`Command "${key}" already has a handler`);
        return;
      }

      handlers[key] = fn;
    },
    unsub(key, fn) {
      if (handlers[key] !== fn) {
        console.error("Handlers do not match");
        return;
      }

      delete handlers[key];
    },
    request(key, data) {
      return new Promise((resolve, reject) => {
        if (!(key in handlers)) {
          reject(`Command "${key}" has no handler`);
          return;
        }

        const res = handlers[key]!(data);

        if (!res.ok) {
          reject(res.error);
          return;
        }

        resolve(res.value);
      });
    },
  };
}
