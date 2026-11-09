export type Tone =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info";

export type UserRole =
  | "STUDENT"
  | "TEACHER"
  | "ADMIN"
  | "MODERATOR";

export type Building = {
  id: string;
  name: string;
  floors: number;
  address: string;
};

export type Classroom = {
  number: string;
  name: string;
  capacity: number;
  type: string;
  equipment: string[];
  active: boolean;
  buildingId: string;
  floor: number;
  computerCount: number;
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