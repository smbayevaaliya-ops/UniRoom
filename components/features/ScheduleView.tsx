"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { findConflicts } from "@/lib/availability";
import { WORKDAY_END, WORKDAY_START } from "@/lib/constants";
import { useOccupations, useRooms } from "@/lib/stores";
import { formatDate, formatDateShort } from "@/lib/time";
import { useToday } from "@/lib/use-today";
import { validateInterval } from "@/lib/validation";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectField, TextField } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/StatCard";
import { Table, THead, Td, Th, Tr } from "@/components/ui/Table";

export default function ScheduleView() {
  const today = useToday();
  const rooms = useRooms();
  const occupations = useOccupations();

  const [dateInput, setDateInput] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [start, setStart] = useState(WORKDAY_START);
  const [end, setEnd] = useState(WORKDAY_END);

  const date = dateInput || today;
  const intervalError = validateInterval(start, end);

  const datesWithData = useMemo(
    () => [...new Set(occupations.map((item) => item.date))].sort(),
    [occupations],
  );

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return occupations
      .filter((item) => item.date === date)
      .filter((item) => roomFilter === "all" || item.room === roomFilter)
      .filter(
        (item) =>
          !query ||
          [item.title, item.group, item.owner].some((value) =>
            value.toLowerCase().includes(query),
          ),
      )
      .sort(
        (a, b) => a.start.localeCompare(b.start) || a.room.localeCompare(b.room),
      );
  }, [occupations, date, roomFilter, search]);

  const { freeRooms, busyCount } = useMemo(() => {
    const bookable = rooms.filter((room) => room.active);
    if (!date || intervalError) return { freeRooms: [], busyCount: 0 };
    const free = bookable.filter(
      (room) =>
        findConflicts(occupations, { room: room.number, date, start, end })
          .length === 0,
    );
    return { freeRooms: free, busyCount: bookable.length - free.length };
  }, [rooms, occupations, date, start, end, intervalError]);

  if (!date) {
    return (
      <Card>
        <EmptyState title="Загрузка расписания…" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={(event) => setDateInput(event.target.value)}
          />
          <SelectField
            label="Аудитория"
            value={roomFilter}
            onChange={(event) => setRoomFilter(event.target.value)}
          >
            <option value="all">Все аудитории</option>
            {rooms.map((room) => (
              <option
  key={`${room.buildingId}-${room.number}`}
  value={`${room.buildingId}-${room.number}`}
>
                {room.name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Начало интервала"
            type="time"
            min={WORKDAY_START}
            max={WORKDAY_END}
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
          <TextField
            label="Конец интервала"
            type="time"
            min={WORKDAY_START}
            max={WORKDAY_END}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
          <TextField
            label="Поиск"
            type="search"
            placeholder="Предмет, группа, преподаватель"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {datesWithData.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">Даты с занятиями:</span>
            {datesWithData.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={item === date ? "primary" : "secondary"}
                onClick={() => setDateInput(item)}
              >
                {formatDateShort(item)}
              </Button>
            ))}
          </div>
        )}
      </Card>

      {intervalError && (
        <Alert tone="warning" title="Интервал указан неверно">
          {intervalError}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Записей на выбранную дату" value={occupations.filter((item) => item.date === date).length} tone="info" />
        <StatCard label="Занято в выбранном интервале" value={busyCount} tone="danger" />
        <StatCard label="Свободно в выбранном интервале" value={freeRooms.length} tone="success" />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-bold text-slate-900">
          Свободные аудитории, {start}–{end}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {freeRooms.length > 0 ? (
            freeRooms.map((room) => {
              const params = new URLSearchParams({
                room: room.number,
                date,
                start,
                end,
              });
              return (
                <Link
                  key={room.number}
                  href={`/book?${params.toString()}`}
                  className="rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Аудитория {room.number}
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">
              {intervalError
                ? "Исправьте интервал, чтобы увидеть свободные аудитории."
                : "В выбранном интервале свободных аудиторий нет."}
            </p>
          )}
        </div>
        {freeRooms.length > 0 && (
          <p className="mt-3 text-xs text-slate-500">
            Нажмите на аудиторию, чтобы перейти к заявке на бронирование.
          </p>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Занятость на {formatDate(date)}
          </h2>
        </div>

        {rows.length > 0 ? (
          <Table>
            <THead>
              <tr>
                <Th>Время</Th>
                <Th>Аудитория</Th>
                <Th>Тип</Th>
                <Th>Название</Th>
                <Th>Группа</Th>
                <Th>Преподаватель / заявитель</Th>
              </tr>
            </THead>
            <tbody>
              {rows.map((item) => (
                <Tr key={item.id}>
                  <Td className="whitespace-nowrap font-medium text-slate-900">
                    {item.start}–{item.end}
                  </Td>
                  <Td>{item.room}</Td>
                  <Td>
                    <Badge tone={item.kind === "LESSON" ? "info" : "success"}>
                      {item.kind === "LESSON" ? "Занятие" : "Бронь"}
                    </Badge>
                  </Td>
                  <Td>{item.title}</Td>
                  <Td>{item.group}</Td>
                  <Td>{item.owner}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState
            title="Занятий не найдено"
            description="На выбранную дату нет занятий по указанным параметрам. Выберите одну из дат с занятиями выше."
          />
        )}
      </Card>
    </div>
  );
}
