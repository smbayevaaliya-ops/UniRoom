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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Расписание аудиторий
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Просмотр занятости аудиторий по выбранной дате.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedDate("")}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Сегодня
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDate(-1)}
            className="rounded-xl border px-3 py-3 hover:bg-gray-50"
            aria-label="Предыдущий день"
          >
            ←
          </button>

          <input
            type="date"
            value={date}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border px-3 py-3"
          />

          <button
            type="button"
            onClick={() => changeDate(1)}
            className="rounded-xl border px-3 py-3 hover:bg-gray-50"
            aria-label="Следующий день"
          >
            →
          </button>
        </div>

        <select
          value={buildingFilter}
          onChange={(event) => {
            setBuildingFilter(event.target.value);
            setRoomFilter("all");
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
          value={roomFilter}
          onChange={(event) => setRoomFilter(event.target.value)}
          className="rounded-xl border px-3 py-3"
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold capitalize text-gray-900">
          {dateLabel}
        </h2>

        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-blue-500" />
            Занятие
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-green-500" />
            Бронирование
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        {filteredOccupations.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-3xl">📅</div>
            <h3 className="mt-3 font-semibold text-gray-900">
              На эту дату занятости нет
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              По выбранным фильтрам занятий и подтверждённых бронирований не найдено.
            </p>
          </div>
        ) : (
          <div>
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
                  className="grid min-h-24 grid-cols-[65px_1fr] border-b last:border-0 sm:grid-cols-[90px_1fr]"
                >
                  <div className="border-r bg-gray-50 p-3 text-sm font-semibold text-gray-500">
                    {hourStart}
                  </div>

                  <div className="space-y-2 p-3">
                    {items.length === 0 ? (
                      <p className="py-2 text-xs text-gray-300">
                        Свободно
                      </p>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-xl border-l-4 p-3 ${
                            item.kind === "LESSON"
                              ? "border-blue-500 bg-blue-50"
                              : "border-green-500 bg-green-50"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {item.start}–{item.end}
                            </span>

                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                item.kind === "LESSON"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {item.kind === "LESSON"
                                ? "Занятие"
                                : "Бронирование"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {roomDetails(item.roomId)}
                          </p>

                          {role !== "STUDENT" && (
                            <>
                              <p className="mt-1 text-sm text-gray-700">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.group} · {item.owner}
                              </p>
                            </>
                          )}

                          {role === "STUDENT" && (
                            <p className="mt-1 text-xs text-gray-500">
                              Аудитория занята
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
