"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "@/lib/time";

function subscribe(): () => void {
  return () => {};
}

/**
 * Сегодняшняя дата (YYYY-MM-DD) в часовом поясе пользователя.
 * На сервере и при гидратации возвращает пустую строку, чтобы разметка
 * не расходилась, затем подставляет реальную дату.
 */
export function useToday(): string {
  return useSyncExternalStore(subscribe, todayISO, () => "");
}
