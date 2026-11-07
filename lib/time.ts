/** Сегодняшняя дата в локальном часовом поясе в формате YYYY-MM-DD. */
export function todayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Проверяет, что строка является датой формата YYYY-MM-DD. */
export function isISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/** Проверяет, что строка является временем формата HH:MM. */
export function isTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/** "2026-11-02" -> "2 ноября 2026 г." */
export function formatDate(iso: string): string {
  if (!isISODate(iso)) return iso;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "2026-11-02" -> "2 ноября" */
export function formatDateShort(iso: string): string {
  if (!isISODate(iso)) return iso;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export function formatRange(start: string, end: string): string {
  return `${start}–${end}`;
}
