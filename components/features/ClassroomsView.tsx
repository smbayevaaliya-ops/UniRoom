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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Аудитории</h1>

        <p className="mt-1 text-sm text-gray-500">
          Просмотр аудиторий, их оборудования и занятости.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Всего аудиторий
          </p>
          <p className="mt-2 text-3xl font-bold">
            {totalCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Есть занятия за день
          </p>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {occupiedCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Свободны весь день
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {freeCount}
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-4">
        <select
          value={buildingFilter}
          onChange={(event) => {
            setBuildingFilter(event.target.value);
            setFloorFilter("all");
          }}
          className="rounded-xl border px-3 py-3"
        >
          <option value="all">Все корпуса</option>

          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>

        <select
          value={floorFilter}
          onChange={(event) => setFloorFilter(event.target.value)}
          className="rounded-xl border px-3 py-3"
        >
          <option value="all">Все этажи</option>

          {floors.map((floor) => (
            <option key={floor} value={floor}>
              {floor} этаж
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          min={today || undefined}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-xl border px-3 py-3"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск аудитории"
          className="rounded-xl border px-3 py-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => {
          const roomDay =
            roomOccupations.get(room.id) ?? [];

          const hasOccupations = roomDay.length > 0;

          return (
            <article
              key={room.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {getBuildingName(room.buildingId)} · {room.floor} этаж
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Аудитория №{room.number}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    !room.active
                      ? "bg-gray-100 text-gray-600"
                      : hasOccupations
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {!room.active
                    ? "Неактивна"
                    : hasOccupations
                      ? "Есть занятия"
                      : "Свободна"}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Тип:</span>{" "}
                  {room.type}
                </p>

                <p>
                  <span className="text-gray-500">
                    Вместимость:
                  </span>{" "}
                  {room.capacity}
                </p>

                <p>
                  <span className="text-gray-500">
                    Компьютеры:
                  </span>{" "}
                  {room.computerCount}
                </p>

                <p>
                  <span className="text-gray-500">
                    Оборудование:
                  </span>{" "}
                  {room.equipment.join(", ") || "Не указано"}
                </p>
              </div>

              {role !== "STUDENT" && roomDay.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="mb-2 text-sm font-semibold">
                    Расписание на день
                  </p>

                  {roomDay.map((item: { id: string; start: string; end: string; title: string; group: string; owner: string }) => (
                    <div
                      key={item.id}
                      className="mb-2 rounded-lg bg-gray-50 p-3 text-sm"
                    >
                      <p className="font-medium">
                        {item.start}–{item.end}
                      </p>

                      <p>{item.title}</p>

                      <p className="text-gray-500">
                        {item.group} · {item.owner}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {role === "STUDENT" && hasOccupations && (
                <p className="mt-4 text-sm text-gray-500">
                  В этой аудитории есть занятия или бронирования.
                  Вы можете выбрать другую свободную пару.
                </p>
              )}

              <Link
                href={`/book?roomId=${encodeURIComponent(room.id)}`}
                aria-disabled={!room.active}
                className={`mt-4 block rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                  room.active
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "pointer-events-none bg-gray-100 text-gray-400"
                }`}
                tabIndex={room.active ? 0 : -1}
              >
                {room.active
                  ? "Забронировать"
                  : "Аудитория недоступна"}
              </Link>
            </article>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          Аудитории не найдены.
        </div>
      )}
    </div>
  );
}