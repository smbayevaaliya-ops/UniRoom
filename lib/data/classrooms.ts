import type { Classroom } from "@/lib/types";

const sixthBuilding: Classroom[] = [];

for (let floor = 1; floor <= 11; floor++) {
  for (let room = 1; room <= 8; room++) {
    const number = `${floor}${String(room).padStart(2, "0")}`;
    const isComputerClass = floor >= 8;

    sixthBuilding.push({
      id: `building-6-${number}`,
      number,
      name: isComputerClass
        ? `Компьютерный класс ${number}`
        : `Лекционная аудитория ${number}`,
      capacity: isComputerClass
        ? 15 + (room % 3) * 5
        : 30 + (room % 6) * 10,
      type: isComputerClass
        ? "Компьютерный класс"
        : "Лекционная",
      equipment: isComputerClass
        ? ["Компьютеры", "Проектор", "Доска"]
        : ["Проектор", "Доска"],
      active: true,
      buildingId: "building-6",
      floor,
      computerCount: isComputerClass
        ? 15 + (room % 3) * 5
        : 0,
    });
  }
}

const firstBuilding: Classroom[] = [];

for (let floor = 1; floor <= 5; floor++) {
  for (let room = 1; room <= 5; room++) {
    const number = `${floor}0${room}`;

    firstBuilding.push({
      id: `building-1-${number}`,
      number,
      name: `Лекционная аудитория ${number}`,
      capacity: 20 + (room % 5) * 10,
      type: "Лекционная",
      equipment: ["Проектор", "Доска"],
      active: true,
      buildingId: "building-1",
      floor,
      computerCount: 0,
    });
  }
}

export const classrooms: Classroom[] = [
  ...sixthBuilding,
  ...firstBuilding,
];