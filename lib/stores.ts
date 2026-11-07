"use client";

import { useMemo } from "react";
import { buildOccupations, findConflicts, type Occupation } from "@/lib/availability";
import { classrooms } from "@/lib/data/classrooms";
import { initialBookings } from "@/lib/data/bookings";
import { lessons } from "@/lib/data/lessons";
import { createPersistentStore } from "@/lib/persistent-store";
import type { Booking, BookingStatus, Classroom } from "@/lib/types";

const bookingsStore = createPersistentStore<Booking[]>(
  "uniroom.bookings.v1",
  initialBookings,
);

const roomsStore = createPersistentStore<Classroom[]>(
  "uniroom.rooms.v1",
  classrooms,
);

export type NewBooking = Omit<Booking, "id" | "status">;

export type AddBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; conflicts: Occupation[] };

/** Создаёт заявку в статусе PENDING, если аудитория свободна. */
export function addBooking(input: NewBooking): AddBookingResult {
  const current = bookingsStore.get();
  const conflicts = findConflicts(buildOccupations(lessons, current), input);
  if (conflicts.length > 0) {
    return { ok: false, conflicts };
  }

  const booking: Booking = {
    ...input,
    id: current.reduce((max, item) => Math.max(max, item.id), 0) + 1,
    status: "PENDING",
  };
  bookingsStore.set([...current, booking]);
  return { ok: true, booking };
}

export type UpdateStatusResult =
  | { ok: true }
  | { ok: false; conflicts: Occupation[] };

/** Меняет статус заявки. Одобрить заявку с конфликтом нельзя. */
export function updateBookingStatus(
  id: number,
  status: BookingStatus,
): UpdateStatusResult {
  const current = bookingsStore.get();
  const target = current.find((item) => item.id === id);
  if (!target) return { ok: true };

  if (status === "APPROVED") {
    const conflicts = findConflicts(
      buildOccupations(lessons, current),
      target,
      `booking-${id}`,
    );
    if (conflicts.length > 0) {
      return { ok: false, conflicts };
    }
  }

  bookingsStore.set(
    current.map((item) => (item.id === id ? { ...item, status } : item)),
  );
  return { ok: true };
}

export function toggleRoomActive(number: string): void {
  roomsStore.set(
    roomsStore
      .get()
      .map((room) =>
        room.number === number ? { ...room, active: !room.active } : room,
      ),
  );
}

/** Возвращает демонстрационные заявки и аудитории к исходному состоянию. */
export function resetDemoData(): void {
  bookingsStore.set(initialBookings);
  roomsStore.set(classrooms);
}

export function useBookings(): Booking[] {
  return bookingsStore.useStore();
}

/** Все занятые интервалы: занятия расписания и одобренные заявки. */
export function useOccupations(): Occupation[] {
  const bookings = bookingsStore.useStore();
  return useMemo(() => buildOccupations(lessons, bookings), [bookings]);
}

export function useRooms(): Classroom[] {
  return roomsStore.useStore();
}
