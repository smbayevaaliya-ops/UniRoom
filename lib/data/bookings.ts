import type { Booking } from "@/lib/types";

export const initialBookings: Booking[] = [
  {
    id: 1,
    requester: "Иван Петров",
    room: "101",
    date: "2026-11-02",
    start: "10:00",
    end: "12:00",
    purpose: "Дополнительное занятие",
    status: "PENDING",
  },
  {
    id: 2,
    requester: "Анна Сидорова",
    room: "204",
    date: "2026-11-03",
    start: "12:00",
    end: "14:00",
    purpose: "Научная встреча",
    status: "PENDING",
  },
  {
    id: 3,
    requester: "Дмитрий Иванов",
    room: "305",
    date: "2026-11-04",
    start: "14:00",
    end: "16:00",
    purpose: "Работа над проектом",
    status: "APPROVED",
  },
];
