"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useBuildings, useOccupations, useRooms } from "@/lib/stores";
import { useRole } from "@/lib/role-store";
import { getRoomDay } from "@/lib/availability";
import { useToday } from "@/lib/use-today";

export default function ClassroomsView() {
  const rooms = useRooms();
  const buildings = useBuildings();
  const occupations = useOccupations();
  const role = useRole();
  const today = useToday();

  const [buildingFilter, setBuildingFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const selectedDate = date || today;

  const floors = useMemo(() => {
    const selectedBuildings =
      buildingFilter === "all"
        ? buildings
        : buildings.filter(
            (building) => building.id === buildingFilter,
          );

    return Array.from(
      new Set(
        selectedBuildings.flatMap((building) =>
          rooms
            .filter((room) => room.buildingId === building.id)
            .map((room) => room.floor),
        ),
      ),
    ).sort((a, b) => a - b);
  }, [buildingFilter, buildings, rooms]);

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesBuilding =
          buildingFilter === "all" ||
          room.buildingId === buildingFilter;

        const matchesFloor =
          floorFilter === "all" ||
          room.floor === Number(floorFilter);

        const searchValue = search.trim().toLowerCase();

        const matchesSearch =
          room.number.toLowerCase().includes(searchValue) ||
          room.name.toLowerCase().includes(searchValue);

        return matchesBuilding && matchesFloor && matchesSearch;
      })
      .sort((a, b) => {
        if (a.buildingId !== b.buildingId) {
          return a.buildingId.localeCompare(b.buildingId);
        }

        if (a.floor !== b.floor) {
          return a.floor - b.floor;
        }

        return a.number.localeCompare(b.number);
      });
  }, [rooms, buildingFilter, floorFilter, search]);

  function getBuildingName(buildingId: string) {
    return (
      buildings.find((building) => building.id === buildingId)?.name ||
      "Корпус не указан"
    );
  }

  const roomOccupations = useMemo(() => {
    if (!selectedDate) return new Map();

    return new Map(
      filteredRooms.map((room) => [
        room.id,
        getRoomDay(occupations, room.id, selectedDate),
      ]),
    );
  }, [filteredRooms, occupations, selectedDate]);

  const totalCount = filteredRooms.length;

  const occupiedCount = filteredRooms.filter((room) => {
    return (roomOccupations.get(room.id) ?? []).length > 0;
  }).length;

  const freeCount = filteredRooms.filter((room) => {
    return (
      room.active &&
      (roomOccupations.get(room.id) ?? []).length === 0
    );
  }).length;

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="space-y-9 pb-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#101a32] px-7 py-10 text-white shadow-xl shadow-slate-900/10 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            University spaces
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Аудитории
            <span className="text-blue-300"> университета.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Исследуйте университетские пространства, проверяйте
            доступность помещений и выбирайте подходящую аудиторию
            для своих занятий.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">
              Поиск помещений
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">
              Проверка занятости
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">
              Онлайн-бронирование
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Обзор помещений
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Состояние аудиторий
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            На выбранную дату
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Всего аудиторий
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                ▦
              </span>
            </div>
            <p className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
              {totalCount}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Найдено по текущим фильтрам
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Есть занятия за день
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
                ◷
              </span>
            </div>
            <p className="mt-5 text-4xl font-bold tracking-tight text-amber-600">
              {occupiedCount}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Заняты хотя бы на один период
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Свободны весь день
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                ✓
              </span>
            </div>
            <p className="mt-5 text-4xl font-bold tracking-tight text-emerald-600">
              {freeCount}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Доступны для бронирования
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
            ⚙
          </div>
          <div>
            <h2 className="font-bold text-slate-900">
              Поиск и фильтрация
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Настройте параметры поиска аудиторий
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Корпус
            </label>
            <select
              value={buildingFilter}
              onChange={(event) => {
                setBuildingFilter(event.target.value);
                setFloorFilter("all");
              }}
              className={inputClass}
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
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Этаж
            </label>
            <select
              value={floorFilter}
              onChange={(event) => setFloorFilter(event.target.value)}
              className={inputClass}
            >
              <option value="all">Все этажи</option>
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  {floor} этаж
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Дата
            </label>
            <input
              type="date"
              value={selectedDate}
              min={today || undefined}
              onChange={(event) => setDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Поиск
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Номер или название..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Каталог помещений
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Доступные аудитории
            </h2>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
            Найдено: {filteredRooms.length}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => {
            const roomDay =
              roomOccupations.get(room.id) ?? [];

            const hasOccupations = roomDay.length > 0;

            const statusClass = !room.active
              ? "border-slate-200 bg-slate-100 text-slate-500"
              : hasOccupations
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700";

            return (
              <article
                key={room.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.06]"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-400">
                        {getBuildingName(room.buildingId)} · {room.floor} этаж
                      </p>

                      <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                        Аудитория №{room.number}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {room.name}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold ${statusClass}`}
                    >
                      {!room.active
                        ? "Неактивна"
                        : hasOccupations
                          ? "Есть занятия"
                          : "Свободна"}
                    </span>
                  </div>

                  <div className="my-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Вместимость
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800">
                        {room.capacity}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                          мест
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Компьютеры
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-800">
                        {room.computerCount}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <span className="shrink-0 text-slate-400">
                        Тип помещения
                      </span>
                      <span className="text-right font-medium text-slate-700">
                        {room.type}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <p className="mb-2 text-xs font-semibold text-slate-500">
                        Оборудование
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {room.equipment.length > 0 ? (
                          room.equipment.map((item, index) => (
                            <span
                              key={`${item}-${index}`}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            Не указано
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {role !== "STUDENT" && roomDay.length > 0 && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Расписание на день
                      </p>

                      {roomDay.map((item: { id: string; start: string; end: string; title: string; group: string; owner: string }) => (
                        <div
                          key={item.id}
                          className="mb-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm"
                        >
                          <p className="font-bold text-blue-800">
                            {item.start}–{item.end}
                          </p>

                          <p className="mt-1 font-medium text-slate-700">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.group} · {item.owner}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {role === "STUDENT" && hasOccupations && (
                    <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                      В этой аудитории есть занятия или бронирования.
                      Вы можете выбрать другую свободную пару.
                    </div>
                  )}

                  <Link
                    href={`/book?roomId=${encodeURIComponent(room.id)}`}
                    aria-disabled={!room.active}
                    className={`mt-auto block rounded-xl px-4 py-3.5 text-center text-sm font-bold transition duration-200 ${
                      room.active
                        ? "mt-6 bg-[#101a32] text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-900/15"
                        : "pointer-events-none mt-6 bg-slate-100 text-slate-400"
                    }`}
                    tabIndex={room.active ? 0 : -1}
                  >
                    {room.active
                      ? "Забронировать аудиторию  →"
                      : "Аудитория недоступна"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl text-slate-400">
              ▦
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              Аудитории не найдены
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Попробуйте изменить параметры поиска или фильтры.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
