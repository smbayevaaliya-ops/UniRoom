"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import {
  describeOccupation,
  findConflicts,
  getRoomDay,
} from "@/lib/availability";
import { timeSlots } from "@/lib/data/time-slots";
import {
  addBooking,
  useBuildings,
  useOccupations,
  useRooms,
} from "@/lib/stores";
import { formatDate } from "@/lib/time";
import { useToday } from "@/lib/use-today";
import { validateBookingForm } from "@/lib/validation";
import type {
  BookingFormErrors,
  BookingFormValues,
} from "@/lib/validation";
import { useRole } from "@/lib/role-store";

import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";

export default function BookingForm() {
  const params = useSearchParams();
  const today = useToday();
  const role = useRole();

  const rooms = useRooms();
  const buildings = useBuildings();
  const occupations = useOccupations();

  const initialRoom =
    params.get("roomId") ?? params.get("room") ?? "";

  const [values, setValues] = useState<BookingFormValues>({
    requester: "",
    room: initialRoom,
    date: params.get("date") ?? "",
    start: params.get("start") ?? "10:00",
    end: params.get("end") ?? "10:50",
    purpose: "",
  });

  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [serverConflicts, setServerConflicts] = useState<string[]>([]);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const date = values.date || today;

  const bookableRooms = useMemo(
    () => rooms.filter((room) => room.active),
    [rooms],
  );

  const selectedRoom = useMemo(
    () =>
      bookableRooms.find(
        (room) =>
          room.id === values.room || room.number === values.room,
      ),
    [bookableRooms, values.room],
  );

  const selectedBuilding = buildings.find(
    (building) => building.id === selectedRoom?.buildingId,
  );

  const liveConflicts = useMemo(() => {
    if (!selectedRoom || !date || !values.start || !values.end) {
      return [];
    }

    return findConflicts(occupations, {
      room: selectedRoom.number,
      roomId: selectedRoom.id,
      date,
      start: values.start,
      end: values.end,
    });
  }, [
    occupations,
    selectedRoom,
    date,
    values.start,
    values.end,
  ]);

  const dayItems = useMemo(
    () =>
      selectedRoom && date
        ? getRoomDay(occupations, selectedRoom.id, date)
        : [],
    [occupations, selectedRoom, date],
  );

  function update<K extends keyof BookingFormValues>(
    key: K,
    value: BookingFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));

    setServerConflicts([]);
    setCreatedId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const candidate = {
      ...values,
      date,
      room: selectedRoom?.id ?? values.room,
    };

    const validationErrors = validateBookingForm(
      candidate,
      bookableRooms.map((room) => room.id),
    );

    if (!selectedRoom) {
      validationErrors.room = "Выберите доступную аудиторию.";
    }

    setErrors(validationErrors);
    setCreatedId(null);
    setServerConflicts([]);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (liveConflicts.length > 0) {
      setServerConflicts(
        liveConflicts.map(describeOccupation),
      );
      return;
    }

        if (!selectedRoom) {
      setErrors({
        ...validationErrors,
        room: "Выберите существующую аудиторию.",
      });
      return;
    }

    const result = addBooking({
      requester: candidate.requester.trim(),
      room: selectedRoom.number,
      roomId: selectedRoom.id,
      buildingId: selectedRoom.buildingId,
      floor: selectedRoom.floor,
      date: candidate.date,
      start: candidate.start,
      end: candidate.end,
      purpose: candidate.purpose.trim(),
    });

    if (!result.ok) {
      setServerConflicts(
        result.conflicts.map(describeOccupation),
      );
      return;
    }
    setCreatedId(result.booking.id);

    setValues((current) => ({
      ...current,
      purpose: "",
    }));
  }

  if (!today) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-500">
          Загрузка формы...
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Бронирование аудитории
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Выберите аудиторию, дату и свободную пару.
            </p>
          </div>

          {createdId !== null && (
            <Alert
              tone="success"
              title={`Заявка №${createdId} отправлена`}
            >
              Заявка создана и ожидает рассмотрения преподавателем.
            </Alert>
          )}

          {serverConflicts.length > 0 && (
            <Alert
              tone="danger"
              title="Аудитория занята в это время"
            >
              <ul className="list-disc space-y-1 pl-5">
                {serverConflicts.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
              Выберите другую пару.
            </Alert>
          )}

          <TextField
            label="Имя заявителя"
            autoComplete="name"
            placeholder="Например, Иван Петров"
            value={values.requester}
            error={errors.requester}
            onChange={(event) =>
              update("requester", event.target.value)
            }
          />

          <SelectField
            label="Аудитория"
            value={selectedRoom?.id ?? ""}
            error={errors.room}
            onChange={(event) =>
              update("room", event.target.value)
            }
          >
            <option value="">Выберите аудиторию</option>

            {bookableRooms.map((room) => {
              const building = buildings.find(
                (item) => item.id === room.buildingId,
              );

              return (
                <option key={room.id} value={room.id}>
                  {building?.name || "Корпус"} · {room.name} ·
                  {room.floor} этаж · {room.capacity} мест
                </option>
              );
            })}
          </SelectField>

          {selectedRoom && (
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">
                {selectedRoom.name}
              </p>

              <div className="mt-2 grid gap-2 text-slate-600 sm:grid-cols-2">
                <p>
                  Корпус: {selectedBuilding?.name || "Не указан"}
                </p>

                <p>Этаж: {selectedRoom.floor}</p>

                <p>
                  Вместимость: {selectedRoom.capacity} человек
                </p>

                <p>Тип: {selectedRoom.type}</p>

                <p>
                  Компьютеры: {selectedRoom.computerCount}
                </p>
              </div>

              {selectedRoom.equipment.length > 0 && (
                <p className="mt-2 text-slate-600">
                  Оборудование:{" "}
                  {selectedRoom.equipment.join(", ")}
                </p>
              )}
            </div>
          )}

          <TextField
            label="Дата бронирования"
            type="date"
            min={today}
            value={date}
            error={errors.date}
            onChange={(event) =>
              update("date", event.target.value)
            }
          />

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Выберите пару
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {timeSlots.map((slot) => {
                const conflicts =
                  selectedRoom && date
                    ? findConflicts(occupations, {
                        room: selectedRoom.number,
                        roomId: selectedRoom.id,
                        date,
                        start: slot.start,
                        end: slot.end,
                      })
                    : [];

                const occupied = conflicts.length > 0;
                const selected =
                  values.start === slot.start &&
                  values.end === slot.end;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={occupied || !selectedRoom}
                    onClick={() => {
                      update("start", slot.start);
                      update("end", slot.end);
                    }}
                    className={`rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                        : occupied
                          ? "cursor-not-allowed border-red-200 bg-red-50 opacity-60"
                          : "border-slate-200 bg-white hover:border-blue-400"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-slate-900">
                      {slot.label}
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      {slot.start}–{slot.end}
                    </span>

                    <span
                      className={`mt-2 block text-xs font-medium ${
                        !selectedRoom
                          ? "text-gray-500"
                          : occupied
                            ? "text-red-600"
                            : "text-green-600"
                      }`}
                    >
                      {!selectedRoom
                        ? "Выберите аудиторию"
                        : occupied
                          ? "Занята"
                          : "Свободна"}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.end && (
              <p className="mt-2 text-sm text-red-600">
                {errors.end}
              </p>
            )}
          </div>

          <TextAreaField
            label="Цель бронирования"
            rows={4}
            maxLength={200}
            placeholder="Например, дополнительное занятие со студентами"
            value={values.purpose}
            error={errors.purpose}
            hint={`${values.purpose.length} / 200`}
            onChange={(event) =>
              update("purpose", event.target.value)
            }
          />

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={!selectedRoom || liveConflicts.length > 0}
            >
              Отправить заявку
            </Button>

            <ButtonLink
              href="/classrooms"
              variant="secondary"
            >
              Выбрать другую аудиторию
            </ButtonLink>
          </div>
        </form>
      </Card>

      <Card className="h-fit p-6">
        <h2 className="text-lg font-bold text-slate-900">
          Доступность
        </h2>

        {!selectedRoom ? (
          <p className="mt-3 text-sm text-slate-500">
            Выберите аудиторию, чтобы увидеть её занятость.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            <p className="text-sm text-slate-600">
              {selectedBuilding?.name} · {selectedRoom.name}
            </p>

            <p className="text-sm text-slate-600">
              {formatDate(date)}
            </p>

            {liveConflicts.length > 0 ? (
              <Alert
                tone="danger"
                title="В выбранное время занято"
              >
                Выберите другую пару.
              </Alert>
            ) : (
              <Alert
                tone="success"
                title="В выбранное время свободно"
              />
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Расписание на день
              </p>

              {dayItems.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Занятий и подтверждённых броней нет.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {dayItems.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg bg-slate-50 p-3 text-sm"
                    >
                      <p className="font-medium text-slate-800">
                        {item.start}–{item.end}
                      </p>

                      {role === "STUDENT" ? (
                        <p className="mt-1 text-slate-500">
                          Аудитория занята
                        </p>
                      ) : (
                        <p className="mt-1 text-slate-600">
                          {describeOccupation(item)} · {item.owner}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}