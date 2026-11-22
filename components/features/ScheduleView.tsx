"use client";

import { useMemo, useState } from "react";

import { useBuildings, useOccupations, useRooms } from "@/lib/stores";
import { useRole } from "@/lib/role-store";
import { useToday } from "@/lib/use-today";

export default function ScheduleView() {
  const occupations = useOccupations();
  const rooms = useRooms();
  const buildings = useBuildings();
  const role = useRole();
  const today = useToday();

  const [selectedDate, setSelectedDate] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");

  const date = selectedDate || today;

  function changeDate(days: number) {
    if (!date) return;

    const next = new Date(`${date}T12:00:00`);
    next.setDate(next.getDate() + days);

    const year = next.getFullYear();
    const month = String(next.getMonth() + 1).padStart(2, "0");
    const day = String(next.getDate()).padStart(2, "0");

    setSelectedDate(`${year}-${month}-${day}`);
  }

  const filteredRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.active !== false &&
          (buildingFilter === "all" ||
            room.buildingId === buildingFilter),
      ),
    [rooms, buildingFilter],
  );

  const filteredOccupations = useMemo(() => {
    if (!date) return [];

    return occupations
      .filter((item) => {
        if (item.date !== date) return false;

        const room = rooms.find(
          (currentRoom) => currentRoom.id === item.roomId,
        );

        if (!room) return false;

        if (
          buildingFilter !== "all" &&
          room.buildingId !== buildingFilter
        ) {
          return false;
        }

        if (roomFilter !== "all" && room.id !== roomFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeComparison = a.start.localeCompare(b.start);

        if (timeComparison !== 0) return timeComparison;

        return a.roomId.localeCompare(b.roomId);
      });
  }, [occupations, rooms, date, buildingFilter, roomFilter]);

  function roomDetails(roomId: string) {
    const room = rooms.find((item) => item.id === roomId);

    if (!room) return "Аудитория не найдена";

    const building = buildings.find(
      (item) => item.id === room.buildingId,
    );

    return `${building?.name || "Корпус"} · ${room.floor} этаж · №${room.number}`;
  }

  const hours = Array.from({ length: 12 }, (_, index) => index + 8);

  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const lessonCount = filteredOccupations.filter(
    (item) => item.kind === "LESSON",
  ).length;

  const bookingCount = filteredOccupations.filter(
    (item) => item.kind !== "LESSON",
  ).length;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[30px] bg-[#101d3a] px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Управление пространством
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Расписание аудиторий
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75 sm:text-base">
              Следите за занятостью помещений, занятиями и бронированиями
              в удобном календарном представлении.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate("")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#17264a] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <span>↻</span>
            Сегодня
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Всего событий
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
              ◷
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {filteredOccupations.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            На выбранную дату
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Учебные занятия
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
              ▣
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {lessonCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Занятость по расписанию
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Бронирования
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
              ✓
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {bookingCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Подтверждённые события
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
            ⚙
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Параметры расписания
            </h2>
            <p className="text-xs text-slate-400">
              Выберите дату и нужные помещения
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Дата
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeDate(-1)}
                className="flex h-12 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                aria-label="Предыдущий день"
              >
                ←
              </button>

              <input
                type="date"
                value={date}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              <button
                type="button"
                onClick={() => changeDate(1)}
                className="flex h-12 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                aria-label="Следующий день"
              >
                →
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Корпус
            </label>
            <select
              value={buildingFilter}
              onChange={(event) => {
                setBuildingFilter(event.target.value);
                setRoomFilter("all");
              }}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">Все корпуса</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Аудитория
            </label>
            <select
              value={roomFilter}
              onChange={(event) => setRoomFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">Все аудитории</option>
              {filteredRooms.map((room) => {
                const building = buildings.find(
                  (item) => item.id === room.buildingId,
                );

                return (
                  <option key={room.id} value={room.id}>
                    {building?.name || "Корпус"} · №{room.number}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Календарь
            </p>
            <h2 className="mt-1 text-xl font-bold capitalize tracking-tight text-slate-900 sm:text-2xl">
              {dateLabel}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="h-3 w-3 rounded bg-blue-500 shadow-sm shadow-blue-500/30" />
              Занятие
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="h-3 w-3 rounded bg-emerald-500 shadow-sm shadow-emerald-500/30" />
              Бронирование
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {filteredOccupations.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                📅
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                На эту дату занятости нет
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                По выбранным фильтрам занятий и подтверждённых бронирований
                не найдено.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Временная шкала
                </span>
                <span className="text-xs text-slate-400">
                  08:00 — 20:00
                </span>
              </div>

              {hours.map((hour) => {
                const hourStart = `${String(hour).padStart(2, "0")}:00`;
                const hourEnd = `${String(hour + 1).padStart(2, "0")}:00`;

                const items = filteredOccupations.filter(
                  (item) =>
                    item.start >= hourStart && item.start < hourEnd,
                );

                return (
                  <div
                    key={hour}
                    className="grid min-h-28 grid-cols-[66px_1fr] border-b border-slate-100 last:border-0 sm:grid-cols-[100px_1fr]"
                  >
                    <div className="border-r border-slate-100 bg-slate-50/70 p-3 sm:p-4">
                      <span className="text-sm font-bold text-slate-500">
                        {hourStart}
                      </span>
                    </div>

                    <div className="min-w-0 p-3 sm:p-4">
                      {items.length === 0 ? (
                        <div className="flex h-full min-h-12 items-center">
                          <span className="text-xs text-slate-300">
                            Свободное время
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`group relative overflow-hidden rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                                item.kind === "LESSON"
                                  ? "border-blue-100 bg-gradient-to-r from-blue-50 to-white hover:border-blue-200"
                                  : "border-emerald-100 bg-gradient-to-r from-emerald-50 to-white hover:border-emerald-200"
                              }`}
                            >
                              <div
                                className={`absolute bottom-0 left-0 top-0 w-1 ${
                                  item.kind === "LESSON"
                                    ? "bg-blue-500"
                                    : "bg-emerald-500"
                                }`}
                              />

                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                                      item.kind === "LESSON"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-emerald-100 text-emerald-700"
                                    }`}
                                  >
                                    {item.kind === "LESSON" ? "У" : "Б"}
                                  </div>

                                  <div>
                                    <p className="text-sm font-bold text-slate-900">
                                      {item.start} — {item.end}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      {roomDetails(item.roomId)}
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                    item.kind === "LESSON"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {item.kind === "LESSON"
                                    ? "Занятие"
                                    : "Бронирование"}
                                </span>
                              </div>

                              {role !== "STUDENT" && (
                                <div className="mt-3 border-t border-slate-200/60 pt-3">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {item.title}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {item.group} · {item.owner}
                                  </p>
                                </div>
                              )}

                              {role === "STUDENT" && (
                                <p className="mt-3 border-t border-slate-200/60 pt-3 text-xs font-medium text-slate-500">
                                  Аудитория занята
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
