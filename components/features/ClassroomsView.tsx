"use client";

import { useMemo, useState } from "react";
import { findConflicts, getRoomDay } from "@/lib/availability";
import { WORKDAY_END, WORKDAY_START } from "@/lib/constants";
import { useOccupations, useRooms } from "@/lib/stores";
import { formatDate } from "@/lib/time";
import { useToday } from "@/lib/use-today";
import { validateInterval } from "@/lib/validation";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TextField } from "@/components/ui/Field";

export default function ClassroomsView() {
  const today = useToday();
  const rooms = useRooms();
  const occupations = useOccupations();

  const [dateInput, setDateInput] = useState("");
  const [start, setStart] = useState(WORKDAY_START);
  const [end, setEnd] = useState(WORKDAY_END);
  const [search, setSearch] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);

  const date = dateInput || today;
  const intervalError = validateInterval(start, end);

  const items = useMemo(() => {
    if (!date) return [];
    const query = search.trim().toLowerCase();
    const min = Number(minCapacity) || 0;

    return rooms
      .map((room) => {
        const conflicts = intervalError
          ? []
          : findConflicts(occupations, { room: room.number, date, start, end });
        return {
          room,
          conflicts,
          day: getRoomDay(occupations, room.number, date),
          free: room.active && !intervalError && conflicts.length === 0,
        };
      })
      .filter(({ room, free }) => {
        const matchesSearch =
          !query ||
          [room.name, room.type, room.number, ...room.equipment].some((value) =>
            value.toLowerCase().includes(query),
          );
        return (
          matchesSearch && room.capacity >= min && (!onlyFree || free)
        );
      });
  }, [rooms, occupations, date, start, end, search, minCapacity, onlyFree, intervalError]);

  if (!date) {
    return (
      <Card>
        <EmptyState title="Загрузка списка аудиторий…" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={(event) => setDateInput(event.target.value)}
          />
          <TextField
            label="Начало"
            type="time"
            min={WORKDAY_START}
            max={WORKDAY_END}
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
          <TextField
            label="Окончание"
            type="time"
            min={WORKDAY_START}
            max={WORKDAY_END}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
          <TextField
            label="Минимальная вместимость"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Например, 25"
            value={minCapacity}
            onChange={(event) => setMinCapacity(event.target.value)}
          />
        </div>

        <div className="mt-4 grid items-end gap-4 sm:grid-cols-2">
          <TextField
            label="Поиск"
            type="search"
            placeholder="Номер, тип или оборудование"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <label className="flex items-center gap-2.5 pb-2.5 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(event) => setOnlyFree(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Показывать только свободные
          </label>
        </div>
      </Card>

      {intervalError ? (
        <Alert tone="warning" title="Статус доступности не рассчитан">
          {intervalError}
        </Alert>
      ) : (
        <p className="text-sm text-slate-500">
          Статус рассчитан для {formatDate(date)}, {start}–{end}. Найдено
          аудиторий: {items.length}.
        </p>
      )}

      {items.length === 0 ? (
        <Card>
          <EmptyState
            title="Аудитории не найдены"
            description="Измените параметры поиска или выберите другое время."
          />
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ room, free, conflicts, day }) => {
            const params = new URLSearchParams({
              room: room.number,
              date,
              start,
              end,
            });
            return (
             <Card key={`${room.buildingId}-${room.number}`} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {room.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">{room.type}</p>
                  </div>
                  {!room.active ? (
                    <Badge tone="neutral">Недоступна</Badge>
                  ) : intervalError ? null : conflicts.length > 0 ? (
                    <Badge tone="danger">Занята</Badge>
                  ) : (
                    <Badge tone="success">Свободна</Badge>
                  )}
                </div>

                <p className="mt-4 text-sm text-slate-700">
                  Вместимость: {room.capacity} чел.
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {room.equipment.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex-1 border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Занятость на дату
                  </p>
                  {day.length === 0 ? (
                    <p className="mt-1.5 text-sm text-slate-500">
                      Занятий и броней нет.
                    </p>
                  ) : (
                    <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                      {day.map((item) => (
                        <li key={item.id}>
                          <span className="font-medium text-slate-800">
                            {item.start}–{item.end}
                          </span>{" "}
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-5">
                  {free ? (
                    <ButtonLink
                      href={`/book?${params.toString()}`}
                      fullWidth
                    >
                      Забронировать
                    </ButtonLink>
                  ) : (
                    <Button fullWidth disabled>
                      {room.active ? "Занята в это время" : "Недоступна"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
