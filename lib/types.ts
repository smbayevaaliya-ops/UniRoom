export type Tone = "neutral" | "success" | "danger" | "warning" | "info";

export type Classroom = {
  /** Номер аудитории, например "101". Используется как идентификатор. */
  number: string;
  name: string;
  capacity: number;
  type: string;
  equipment: string[];
  /** Доступна ли аудитория для бронирования. */
  active: boolean;
};

export type Lesson = {
  id: string;
  /** Дата в формате YYYY-MM-DD */
  date: string;
  /** Время начала в формате HH:MM */
  start: string;
  /** Время окончания в формате HH:MM */
  end: string;
  /** Номер аудитории */
  room: string;
  subject: string;
  group: string;
  teacher: string;
};

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type Booking = {
  id: number;
  requester: string;
  /** Номер аудитории */
  room: string;
  date: string;
  start: string;
  end: string;
  purpose: string;
  status: BookingStatus;
};
