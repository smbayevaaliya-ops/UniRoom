"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { rooms, lessons } from "@/lib/universityData";

export default function ClassroomsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Все типы");
  const [currentDay, setCurrentDay] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState(-1);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const days = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ];

      setCurrentDay(days[now.getDay()]);
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    };

    updateTime();

    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  const roomList = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch = room.number
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        selectedType === "Все типы" || room.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [search, selectedType]);

  const getRoomStatus = (roomNumber: string) => {
    if (!currentDay || currentMinutes < 0) return null;

    return lessons.find((lesson) => {
      if (lesson.room !== roomNumber || lesson.day !== currentDay) {
        return false;
      }

      const [start, end] = lesson.time.split("–");
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      return currentMinutes >= startTime && currentMinutes < endTime;
    });
  };

  const occupiedCount = rooms.filter(
    (room) => getRoomStatus(room.number)
  ).length;

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-700">
            УПРАВЛЕНИЕ ПРОСТРАНСТВОМ
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Аудитории
          </h1>

          <p className="mt-2 text-slate-500">
            Каталог помещений университета и их текущая занятость.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Всего помещений</p>
            <p className="mt-2 text-3xl font-semibold">{rooms.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Свободно сейчас</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">
              {rooms.length - occupiedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Занято сейчас</p>
            <p className="mt-2 text-3xl font-semibold text-blue-700">
              {occupiedCount}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по номеру аудитории"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option>Все типы</option>
            <option>Компьютерный класс</option>
            <option>Лекционная аудитория</option>
            <option>Коворкинг</option>
            <option>Не определено</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roomList.map((room) => {
            const activeLesson = getRoomStatus(room.number);

            return (
              <div
                key={room.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{room.type}</p>
                    <h2 className="mt-2 text-3xl font-semibold">
                      {room.number}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      activeLesson
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {activeLesson ? "Занята" : "Свободна"}
                  </span>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-500">
                    Вместимость: {room.capacity} человек
                  </p>

                  {activeLesson && (
                    <div className="mt-3 text-sm">
                      <p className="font-medium text-slate-800">
                        {activeLesson.subject}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {activeLesson.time}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/booking?room=${room.number}`}
                    className="mt-5 block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {roomList.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Аудитории не найдены.
          </div>
        )}
      </div>
    </main>
  );
}