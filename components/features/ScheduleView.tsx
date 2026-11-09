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

  const filteredRooms = useMemo(() => {
    return rooms.filter(
      (room) =>
        buildingFilter === "all" ||
        room.buildingId === buildingFilter,
    );
  }, [rooms, buildingFilter]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Расписание</h1>

        <p className="mt-1 text-sm text-gray-500">
          Занятость аудиторий по выбранной дате.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-3">
        <input
          type="date"
          value={date}
          min={today || undefined}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="rounded-xl border px-3 py-3"
        />

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
                {building?.name || "Корпус"} · №{room.number} · {room.floor} этаж
              </option>
            );
          })}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid grid-cols-[110px_1fr] border-b bg-gray-50 p-4 text-sm font-semibold">
          <span>Время</span>
          <span>Занятость</span>
        </div>

        {filteredOccupations.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            На выбранную дату занятий и подтверждённых бронирований нет.
          </div>
        ) : (
          filteredOccupations.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[110px_1fr] gap-3 border-b p-4 last:border-0"
            >
              <div className="text-sm font-semibold">
                {item.start}

                <span className="block font-normal text-gray-500">
                  {item.end}
                </span>
              </div>

              <div>
                <div className="font-medium">
                  {roomDetails(item.roomId)}
                </div>

                {role === "STUDENT" ? (
                  <p className="mt-1 text-sm text-gray-500">
                    Аудитория занята
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-sm">{item.title}</p>

                    <p className="text-sm text-gray-500">
                      {item.group} · {item.owner}
                    </p>
                  </>
                )}

                <span
                  className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}