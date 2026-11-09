import type { Booking, Lesson } from "@/lib/types";

export type Occupation = {
  id: string;
  kind: "LESSON" | "BOOKING";
  room: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  title: string;
  group: string;
  owner: string;
};

export type OccupationQuery = {
  room: string;
  roomId?: string;
  date: string;
  start: string;
  end: string;
};

export function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function buildOccupations(
  lessons: Lesson[],
  bookings: Booking[],
): Occupation[] {
  const fromLessons: Occupation[] = lessons.map((lesson) => ({
    id: `lesson-${lesson.id}`,
    kind: "LESSON",
    room: lesson.room,
    roomId: lesson.roomId || `building-6-${lesson.room}`,
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
      roomId: booking.roomId || `building-6-${booking.room}`,
      date: booking.date,
      start: booking.start,
      end: booking.end,
      title: booking.purpose,
      group: "—",
      owner: booking.requester,
    }));

  return [...fromLessons, ...fromBookings];
}

export function findConflicts(
  occupations: Occupation[],
  query: OccupationQuery,
  ignoreId?: string,
): Occupation[] {
  const roomId = query.roomId || `building-6-${query.room}`;

  return occupations.filter(
    (item) =>
      item.id !== ignoreId &&
      item.roomId === roomId &&
      item.date === query.date &&
      timesOverlap(
        item.start,
        item.end,
        query.start,
        query.end,
      ),
  );
}

export function getRoomDay(
  occupations: Occupation[],
  room: string,
  date: string,
): Occupation[] {
  return occupations
    .filter(
      (item) =>
        (item.roomId === room || item.room === room) &&
        item.date === date,
    )
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function describeOccupation(item: Occupation): string {
  return `${item.start}–${item.end} ${item.title}`;
}