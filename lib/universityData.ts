export type Lesson = {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: string;
};

export type BookingRequest = {
  id: string;
  name: string;
  role: string;
  room: string;
  date: string;
  start: string;
  end: string;
  people: number;
  purpose: string;
  status: "На рассмотрении" | "Одобрена" | "Отклонена";
};

export const rooms = [
  { number: "804", type: "Компьютерный класс", capacity: 25 },
  { number: "805", type: "Компьютерный класс", capacity: 25 },
  { number: "1103", type: "Компьютерный класс", capacity: 25 },
  { number: "1107", type: "Компьютерный класс", capacity: 25 },

  { number: "402", type: "Лекционная аудитория", capacity: 60 },
  { number: "501", type: "Лекционная аудитория", capacity: 60 },
  { number: "502", type: "Лекционная аудитория", capacity: 60 },
  { number: "503", type: "Лекционная аудитория", capacity: 60 },
  { number: "504", type: "Лекционная аудитория", capacity: 60 },

  { number: "807", type: "Коворкинг", capacity: 20 },
  { number: "808", type: "Коворкинг", capacity: 20 },
  { number: "809", type: "Коворкинг", capacity: 20 },

  { number: "1006", type: "Не определено", capacity: 25 },
];

export const lessons: Lesson[] = [
  {
    id: "1",
    day: "Понедельник",
    time: "14:45–15:35",
    subject: "Программирование систем",
    teacher: "Тыныкулова А.С.",
    room: "502",
    type: "Лекция",
  },
  {
    id: "2",
    day: "Понедельник",
    time: "14:45–15:35",
    subject: "Программирование систем",
    teacher: "Наурызбаева С.А.",
    room: "1107",
    type: "Практика",
  },
  {
    id: "3",
    day: "Вторник",
    time: "11:50–12:40",
    subject: "Frontend и Backend разработка",
    teacher: "Дурбенов Р.М.",
    room: "804",
    type: "Практика",
  },
  {
    id: "4",
    day: "Вторник",
    time: "13:50–14:40",
    subject: "Frontend и Backend разработка",
    teacher: "Дурбенов Р.М.",
    room: "502",
    type: "Лекция",
  },
  {
    id: "5",
    day: "Среда",
    time: "14:45–15:35",
    subject: "Машинное обучение",
    teacher: "Анарбекова Г.А.",
    room: "502",
    type: "Лекция",
  },
  {
    id: "6",
    day: "Среда",
    time: "15:40–16:30",
    subject: "Машинное обучение",
    teacher: "Анарбекова Г.А.",
    room: "805",
    type: "Практика",
  },
  {
    id: "7",
    day: "Четверг",
    time: "15:40–16:30",
    subject: "Системное и сетевое администрирование",
    teacher: "Мусабеков А.К.",
    room: "808",
    type: "Лекция",
  },
  {
    id: "8",
    day: "Четверг",
    time: "16:45–17:35",
    subject: "Java программирование",
    teacher: "Адиков А.К.",
    room: "1103",
    type: "Практика",
  },
  {
    id: "9",
    day: "Четверг",
    time: "16:45–17:35",
    subject: "Системное и сетевое администрирование",
    teacher: "Мусабеков А.К.",
    room: "1006",
    type: "Практика",
  },
];

const REQUESTS_KEY = "uniroom_requests";

export function getRequests(): BookingRequest[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRequests(requests: BookingRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("uniroom-requests"));
}