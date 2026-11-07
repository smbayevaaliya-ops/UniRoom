"use client";

import { useSyncExternalStore } from "react";

/**
 * Небольшое клиентское хранилище с сохранением в localStorage.
 * Временная замена серверным данным: на этапе подключения базы данных
 * его заменят запросы к серверу.
 *
 * На сервере и при гидратации используется значение `initial`,
 * поэтому разметка совпадает с серверной, а сохранённые данные
 * подставляются сразу после гидратации.
 */
export function createPersistentStore<T>(key: string, initial: T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function get(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      cache = initial;
    }
    return cache;
  }

  function set(next: T): void {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Хранилище недоступно (например, приватный режим): данные живут до перезагрузки.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    function onStorage(event: StorageEvent) {
      if (event.key === key) {
        cache = undefined;
        listener();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useStore(): T {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, useStore };
}
