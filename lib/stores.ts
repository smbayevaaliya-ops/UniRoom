"use client";

import { useMemo } from "react";
import {
  buildOccupations,
  findConflicts,
  type Occupation,
} from "@/lib/availability";
import { classrooms } from "@/lib/data/classrooms";
import { buildings } from "@/lib/data/buildings";
import { initialBookings } from "@/lib/data/bookings";
import { lessons } from "@/lib/data/lessons";
import { createPersistentStore } from "@/lib/persistent-store";
import type {
  Booking,
  BookingStatus,
  Building,
  Classroom,
} from "@/lib/types";

const bookingsStore = createPersistentStore<Booking[]>(
  "uniroom.bookings.v2",
  initialBookings,
);

const roomsStore = createPersistentStore<Classroom[]>(
  "uniroom.rooms.v2",
  classrooms,
);

const buildingsStore = createPersistentStore<Building[]>(
  "uniroom.buildings.v1",
  buildings,
);

export type NewBooking = Omit<Booking, "id" | "status">;

export type AddBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; conflicts: Occupation[]; message?: string };

export function addBooking(input: NewBooking): AddBookingResult {
  const current = bookingsStore.get();
  const rooms = roomsStore.get();

  const selectedRoom = rooms.find(
    (room) => room.id === input.roomId,
  );

  if (!selectedRoom || !selectedRoom.active) {
    return {
      ok: false,
      conflicts: [],
      message: "Эта аудитория недоступна для бронирования.",
    };
  }

  const conflicts = findConflicts(
    buildOccupations(lessons, current),
    {
      room: input.room,
      roomId: selectedRoom.id,
      date: input.date,
      start: input.start,
      end: input.end,
    },
  );

  if (conflicts.length > 0) {
    return { ok: false, conflicts };
  }

  const booking: Booking = {
    ...input,
    id:
      current.reduce(
        (max, item) => Math.max(max, item.id),
        0,
      ) + 1,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  bookingsStore.set([...current, booking]);

  return { ok: true, booking };
}

export type UpdateStatusResult =
  | { ok: true }
  | { ok: false; conflicts: Occupation[] };

export function updateBookingStatus(
  id: number,
  status: BookingStatus,
  comment?: string,
): UpdateStatusResult {
  const current = bookingsStore.get();
  const target = current.find((item) => item.id === id);

  if (!target) {
    return { ok: false, conflicts: [] };
  }

  if (status === "APPROVED") {
    const conflicts = findConflicts(
      buildOccupations(lessons, current),
      {
        room: target.room,
        roomId: target.roomId,
        date: target.date,
        start: target.start,
        end: target.end,
      },
      `booking-${id}`,
    );

    if (conflicts.length > 0) {
      return { ok: false, conflicts };
    }
  }

  bookingsStore.set(
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            comment: comment?.trim() || undefined,
          }
        : item,
    ),
  );

  return { ok: true };
}

export function toggleRoomActive(roomId: string): void {
  roomsStore.set(
    roomsStore.get().map((room) =>
      room.id === roomId
        ? { ...room, active: !room.active }
        : room,
    ),
  );
}

export function addRoom(
  input: Omit<Classroom, "id">,
): { ok: boolean; message?: string } {
  const current = roomsStore.get();
  const currentBuildings = buildingsStore.get();

  const building = currentBuildings.find(
    (item) => item.id === input.buildingId,
  );

  if (!building) {
    return { ok: false, message: "Корпус не найден." };
  }

  if (input.floor < 1 || input.floor > building.floors) {
    return {
      ok: false,
      message: "Указан неверный этаж.",
    };
  }

  const duplicate = current.some(
    (room) =>
      room.buildingId === input.buildingId &&
      room.number.trim() === input.number.trim(),
  );

  if (duplicate) {
    return {
      ok: false,
      message: "Аудитория с таким номером уже существует в этом корпусе.",
    };
  }

  const room: Classroom = {
    ...input,
    id: `${input.buildingId}-${input.number.trim()}`,
    number: input.number.trim(),
  };

  roomsStore.set([...current, room]);

  return { ok: true };
}

export function updateRoom(
  roomId: string,
  changes: Partial<Omit<Classroom, "id">>,
): { ok: boolean; message?: string } {
  const current = roomsStore.get();
  const target = current.find((room) => room.id === roomId);

  if (!target) {
    return { ok: false, message: "Аудитория не найдена." };
  }

  const nextBuildingId = changes.buildingId ?? target.buildingId;
  const nextNumber = changes.number?.trim() ?? target.number;
  const nextFloor = changes.floor ?? target.floor;

  const building = buildingsStore
    .get()
    .find((item) => item.id === nextBuildingId);

  if (!building || nextFloor < 1 || nextFloor > building.floors) {
    return { ok: false, message: "Проверьте корпус и этаж." };
  }

  const duplicate = current.some(
    (room) =>
      room.id !== roomId &&
      room.buildingId === nextBuildingId &&
      room.number === nextNumber,
  );

  if (duplicate) {
    return {
      ok: false,
      message: "Такая аудитория уже есть в выбранном корпусе.",
    };
  }

  roomsStore.set(
    current.map((room) =>
      room.id === roomId
        ? {
            ...room,
            ...changes,
            number: nextNumber,
            buildingId: nextBuildingId,
            floor: nextFloor,
          }
        : room,
    ),
  );

  return { ok: true };
}

export function deleteRoom(
  roomId: string,
): { ok: boolean; message?: string } {
  const hasBookings = bookingsStore
    .get()
    .some((booking) => booking.roomId === roomId);

  const hasLessons = lessons.some(
    (lesson) => lesson.roomId === roomId,
  );

  if (hasBookings || hasLessons) {
    return {
      ok: false,
      message: "Нельзя удалить аудиторию, у которой есть занятия или заявки.",
    };
  }

  roomsStore.set(
    roomsStore.get().filter((room) => room.id !== roomId),
  );

  return { ok: true };
}

export function addBuilding(
  input: Omit<Building, "id">,
): { ok: boolean; message?: string } {
  const current = buildingsStore.get();

  const duplicate = current.some(
    (building) =>
      building.name.trim().toLowerCase() ===
      input.name.trim().toLowerCase(),
  );

  if (duplicate) {
    return {
      ok: false,
      message: "Корпус с таким названием уже существует.",
    };
  }

  const id = `building-${Date.now()}`;

  buildingsStore.set([
    ...current,
    {
      ...input,
      id,
    },
  ]);

  return { ok: true };
}

export function updateBuilding(
  id: string,
  changes: Partial<Omit<Building, "id">>,
): { ok: boolean; message?: string } {
  const current = buildingsStore.get();

  if (
    changes.floors !== undefined &&
    roomsStore.get().some(
      (room) =>
        room.buildingId === id &&
        room.floor > changes.floors!,
    )
  ) {
    return {
      ok: false,
      message: "Нельзя уменьшить количество этажей: на них есть аудитории.",
    };
  }

  buildingsStore.set(
    current.map((building) =>
      building.id === id
        ? { ...building, ...changes }
        : building,
    ),
  );

  return { ok: true };
}

export function deleteBuilding(
  id: string,
): { ok: boolean; message?: string } {
  const hasRooms = roomsStore
    .get()
    .some((room) => room.buildingId === id);

  if (hasRooms) {
    return {
      ok: false,
      message: "Сначала удалите аудитории этого корпуса.",
    };
  }

  buildingsStore.set(
    buildingsStore.get().filter((building) => building.id !== id),
  );

  return { ok: true };
}

export function resetDemoData(): void {
  bookingsStore.set(initialBookings);
  roomsStore.set(classrooms);
  buildingsStore.set(buildings);
}

export function useBookings(): Booking[] {
  return bookingsStore.useStore();
}

export function useRooms(): Classroom[] {
  return roomsStore.useStore();
}

export function useBuildings(): Building[] {
  return buildingsStore.useStore();
}

export function useOccupations(): Occupation[] {
  const bookings = bookingsStore.useStore();

  return useMemo(
    () => buildOccupations(lessons, bookings),
    [bookings],
  );
}