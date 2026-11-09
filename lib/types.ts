export type Tone =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type Building = {
  id: string;
  name: string;
  floors: number;
  address: string;
};

export type Classroom = {
  id: string;
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
  roomId?: string;
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
  roomId?: string;
  buildingId?: string;
  floor?: number;
  date: string;
  start: string;
  end: string;
  purpose: string;
  status: BookingStatus;
  comment?: string;
  people?: string;
  createdAt?: string;
};

export type TimeSlot = {
  id: number;
  label: string;
  start: string;
  end: string;
};