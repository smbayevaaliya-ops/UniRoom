
"use client";

import { useState } from "react";
import Header from "@/components/Header";

const lessons = [
  { day: "2026-11-02", time: "08:00–09:50", room: "101", subject: "Математика", group: "ИТ-23", teacher: "Иванов И.И." },
  { day: "2026-11-02", time: "10:00–11:50", room: "204", subject: "Программирование", group: "ИТ-21", teacher: "Петрова А.С." },
  { day: "2026-11-02", time: "12:00–13:50", room: "305", subject: "Базы данных", group: "ИТ-22", teacher: "Сидоров Д.К." },
  { day: "2026-11-03", time: "08:00–09:50", room: "204", subject: "Веб-разработка", group: "ИТ-23", teacher: "Иванов И.И." },
  { day: "2026-11-03", time: "10:00–11:50", room: "101", subject: "Физика", group: "ИТ-21", teacher: "Ким А.А." },
  { day: "2026-11-03", time: "14:00–15:50", room: "412", subject: "Компьютерные сети", group: "ИТ-22", teacher: "Сидоров Д.К." },
  { day: "2026-11-04", time: "09:00–10:50", room: "305", subject: "Алгоритмы", group: "ИТ-23", teacher: "Петрова А.С." },
  { day: "2026-11-04", time: "12:00–13:50", room: "508", subject: "Английский язык", group: "ИТ-21", teacher: "Ким А.А." },
];

const rooms = ["101", "204", "305", "412", "508", "601"];

export default function SchedulePage() {
  const [date, setDate] = useState("2026-11-02");
  const [room, setRoom] = useState("Все аудитории");
  const [search, setSearch] = useState("");

  const filteredLessons = lessons.filter((lesson) => {
    const matchesDate = lesson.day === date;
    const matchesRoom = room === "Все аудитории" || lesson.room === room;
    const matchesSearch =
      lesson.subject.toLowerCase().includes(search.toLowerCase()) ||
      lesson.group.toLowerCase().includes(search.toLowerCase()) ||
      lesson.teacher.toLowerCase().includes(search.toLowerCase());

    return matchesDate && matchesRoom && matchesSearch;
  });

  const occupiedRooms = lessons
    .filter((lesson) => lesson.day === date)
    .map((lesson) => lesson.room);

  const freeRooms = rooms.filter((item) => !occupiedRooms.includes(item));

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-800">
            UniRoom
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Расписание аудиторий
          </h1>
          <p className="mt-2 text-slate-500">
            Просматривайте занятия и находите свободные аудитории.
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Выберите дату
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Аудитория
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800"
            >
              <option>Все аудитории</option>
              {rooms.map((item) => (
                <option key={item} value={item}>
                  Аудитория {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Поиск
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Предмет, группа или преподаватель"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800"
            />
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Занятые аудитории</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {occupiedRooms.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Свободные аудитории</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {freeRooms.length}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Свободные аудитории
          </h2>
          <div className="flex flex-wrap gap-3">
            {freeRooms.length > 0 ? (
              freeRooms.map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-green-100 px-4 py-2 font-medium text-green-800"
                >
                  № {item}
                </span>
              ))
            ) : (
              <p className="text-slate-500">
                На выбранную дату свободных аудиторий нет.
              </p>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Занятия на выбранную дату
            </h2>
          </div>

          {filteredLessons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-6 py-4">Время</th>
                    <th className="px-6 py-4">Аудитория</th>
                    <th className="px-6 py-4">Предмет</th>
                    <th className="px-6 py-4">Группа</th>
                    <th className="px-6 py-4">Преподаватель</th>
                    <th className="px-6 py-4">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((lesson, index) => (
                    <tr key={index} className="border-t border-slate-100">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                        {lesson.time}
                      </td>
                      <td className="px-6 py-4">{lesson.room}</td>
                      <td className="px-6 py-4">{lesson.subject}</td>
                      <td className="px-6 py-4">{lesson.group}</td>
                      <td className="px-6 py-4">{lesson.teacher}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Занята
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-slate-500">
              Занятий по выбранным параметрам не найдено.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
