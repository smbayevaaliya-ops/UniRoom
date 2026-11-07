import type { Classroom } from "@/lib/types";

export const classrooms: Classroom[] = [
  {
    number: "101",
    name: "Аудитория 101",
    capacity: 30,
    type: "Лекционная",
    equipment: ["Проектор", "Доска", "Компьютеры"],
    active: true,
  },
  {
    number: "204",
    name: "Аудитория 204",
    capacity: 20,
    type: "Учебная",
    equipment: ["Проектор", "Доска"],
    active: true,
  },
  {
    number: "305",
    name: "Аудитория 305",
    capacity: 40,
    type: "Лекционная",
    equipment: ["Проектор", "Компьютеры"],
    active: true,
  },
  {
    number: "412",
    name: "Аудитория 412",
    capacity: 15,
    type: "Компьютерный класс",
    equipment: ["Компьютеры", "Проектор"],
    active: true,
  },
  {
    number: "508",
    name: "Аудитория 508",
    capacity: 25,
    type: "Учебная",
    equipment: ["Доска", "Проектор"],
    active: true,
  },
  {
    number: "601",
    name: "Аудитория 601",
    capacity: 35,
    type: "Лекционная",
    equipment: ["Проектор", "Доска"],
    active: true,
  },
];
