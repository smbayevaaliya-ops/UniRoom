export type Tone = "neutral" | "success" | "danger" | "warning" | "info";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type Classroom = {
  number: string;
  name: string;
  capacity: number;
  type: string;
  equipment: string[];
  active: boolean;
};

export type Lesson = {
  id: string;
  date: string;
  start: string;
  end: string;
  room: string;
  subject: string;
  group: string;
  teacher: string;
};

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "REVISION";

export type Booking = {
  id: number;
  requester: string;
  room: string;
  date: string;
  start: string;
  end: string;
  purpose: string;
  status: BookingStatus;
  comment?: string;
};