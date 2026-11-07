import type { Booking, Lesson } from "@/lib/types";

export type Occupation = {
  id: string;
  kind: "LESSON" | "BOOKING";
  room: string;
  date: string;
  start: string;
  end: string;
  /** Название занятия или цель бронирования */
  title: string;
  /** Группа (для занятий) */
  group: string;
  /** Преподаватель (для занятий) или заявитель (для броней) */
  owner: string;
};

export type OccupationQuery = {
  room: string;
  date: string;
  start: string;
  end: string;
};

/**
 * Два интервала HH:MM пересекаются, если каждый начинается раньше,
 * чем заканчивается другой. Интервалы, которые лишь касаются
 * границами (09:50 и 09:50), не пересекаются.
 * Строки HH:MM с ведущими нулями корректно сравниваются лексикографически.
 */
export function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Собирает все занятые интервалы: занятия расписания и одобренные заявки.
 * Заявки в статусе PENDING, REJECTED и CANCELLED аудиторию не занимают.
 */
export function buildOccupations(
  lessons: Lesson[],
  bookings: Booking[],
): Occupation[] {
  const fromLessons: Occupation[] = lessons.map((lesson) => ({
    id: `lesson-${lesson.id}`,
    kind: "LESSON",
    room: lesson.room,
    date: lesson.date,
    start: lesson.start,
    end: lesson.end,
    title: lesson.subject,
    group: lesson.group,
    owner: lesson.teacher,
  }));

  const fromBookings: Occupation[] = bookings
    .filter((booking) => booking.status === "APPROVED")
    .map((booking) => ({
      id: `booking-${booking.id}`,
      kind: "BOOKING",
      room: booking.room,
      date: booking.date,
      start: booking.start,
      end: booking.end,
      title: booking.purpose,
      group: "—",
      owner: booking.requester,
    }));

  return [...fromLessons, ...fromBookings];
}

/** Возвращает занятые интервалы, пересекающиеся с запрошенным. */
export function findConflicts(
  occupations: Occupation[],
  query: OccupationQuery,
  ignoreId?: string,
): Occupation[] {
  return occupations.filter(
    (item) =>
      item.id !== ignoreId &&
      item.room === query.room &&
      item.date === query.date &&
      timesOverlap(item.start, item.end, query.start, query.end),
  );
}

/** Занятость одной аудитории на дату, по возрастанию времени начала. */
export function getRoomDay(
  occupations: Occupation[],
  room: string,
  date: string,
): Occupation[] {
  return occupations
    .filter((item) => item.room === room && item.date === date)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function describeOccupation(item: Occupation): string {
  return `${item.start}–${item.end} ${item.title}`;
}
