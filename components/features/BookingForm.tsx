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
import { teachers } from "@/lib/data/teachers";
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

const STUDENT_NAME_KEY = "uniroom.student-name.v1";

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
    teacherId: "",
    room: initialRoom,
    date: params.get("date") ?? "",
    start: params.get("start") ?? "10:00",
    end: params.get("end") ?? "10:50",
    purpose: "",
  });

  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [serverConflicts, setServerConflicts] = useState<string[]>([]);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreatedId(null);
    setServerConflicts([]);
    setSubmitError("");

    try {
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

      if (Object.keys(validationErrors).length > 0) {
        setSubmitError(
          "Проверьте заполнение формы. Исправьте отмеченные поля.",
        );
        return;
      }

      if (liveConflicts.length > 0) {
        setServerConflicts(
          liveConflicts.map(describeOccupation),
        );
        setSubmitError(
          "Заявка не отправлена: выбранная аудитория занята.",
        );
        return;
      }

      if (!selectedRoom) {
        setSubmitError("Не удалось определить аудиторию.");
        return;
      }

      const requester = candidate.requester.trim();

      const result = addBooking({
        requester,
        teacherId: candidate.teacherId,
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

        setSubmitError(
          result.message ||
            (result.conflicts.length > 0
              ? "Выбранное время занято. Выберите другую пару."
              : "Не удалось создать заявку."),
        );
        return;
      }

      try {
        localStorage.setItem(STUDENT_NAME_KEY, requester);
      } catch {
        // Заявка уже создана. Ошибка записи имени не отменяет бронирование.
      }

      setCreatedId(result.booking.id);
      setSubmitError("");

      setValues((current) => ({
        ...current,
        purpose: "",
      }));
    } catch (error) {
      console.error("Ошибка отправки заявки:", error);

      setSubmitError(
        "Произошла ошибка при отправке заявки. Попробуйте ещё раз.",
      );
    }
  }

  if (!today) {
    return (
      <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Загрузка формы...
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[30px] bg-[#101d3a] px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            UniRoom · Бронирование
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Забронировать аудиторию
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75 sm:text-base">
            Выберите преподавателя, подходящее помещение и свободное
            время. Заявка будет направлена на рассмотрение.
          </p>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
                  01
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Информация о заявке
                  </h2>
                  <p className="text-xs text-slate-400">
                    Заполните основные данные
                  </p>
                </div>
              </div>
            </div>

            {createdId !== null && (
              <Alert
                tone="success"
                title={`Заявка №${createdId} отправлена`}
              >
                Заявка создана и направлена выбранному преподавателю
                на рассмотрение.
              </Alert>
            )}

            {submitError && (
              <Alert
                tone="danger"
                title="Не удалось отправить заявку"
              >
                {submitError}
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

            <div className="grid gap-5 sm:grid-cols-2">
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
                label="Преподаватель"
                value={values.teacherId}
                error={errors.teacherId}
                onChange={(event) =>
                  update("teacherId", event.target.value)
                }
              >
                <option value="">Выберите преподавателя</option>

                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
                  02
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Выбор аудитории
                  </h2>
                  <p className="text-xs text-slate-400">
                    Доступные помещения университета
                  </p>
                </div>
              </div>

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
                <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-center justify-between border-b border-blue-100/80 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        Выбранное помещение
                      </p>
                      <h3 className="mt-1 font-bold text-slate-900">
                        {selectedRoom.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Доступна
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-400">Корпус</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedBuilding?.name || "Не указан"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Этаж</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedRoom.floor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Вместимость</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedRoom.capacity} человек
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Тип</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedRoom.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Компьютеры</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedRoom.computerCount}
                      </p>
                    </div>
                  </div>

                  {selectedRoom.equipment.length > 0 && (
                    <div className="border-t border-blue-100/80 px-4 py-3">
                      <p className="text-xs text-slate-400">
                        Оборудование
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {selectedRoom.equipment.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
                  03
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Дата и время
                  </h2>
                  <p className="text-xs text-slate-400">
                    Выберите удобную дату и свободную пару
                  </p>
                </div>
              </div>

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

              <div className="mt-5">
                <label className="mb-3 block text-sm font-semibold text-slate-700">
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
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                            : occupied
                              ? "cursor-not-allowed border-red-100 bg-red-50/70 opacity-70"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <span className="block text-sm font-bold text-slate-900">
                          {slot.label}
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          {slot.start}–{slot.end}
                        </span>

                        <span
                          className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${
                            !selectedRoom
                              ? "text-slate-400"
                              : occupied
                                ? "text-red-600"
                                : "text-emerald-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              !selectedRoom
                                ? "bg-slate-300"
                                : occupied
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                            }`}
                          />
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
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
                  04
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Цель бронирования
                  </h2>
                  <p className="text-xs text-slate-400">
                    Укажите назначение помещения
                  </p>
                </div>
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
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
              <Button
                type="submit"
                disabled={!selectedRoom}
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

        <div className="space-y-5 lg:sticky lg:top-6">
          <Card className="rounded-2xl border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                ◷
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Доступность
                </h2>
                <p className="text-xs text-slate-400">
                  Проверка расписания
                </p>
              </div>
            </div>

            {!selectedRoom ? (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-500">
                  Выберите аудиторию, чтобы увидеть её занятость.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedBuilding?.name} · {selectedRoom.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(date)}
                  </p>
                </div>

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

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Расписание на день
                  </p>

                  {dayItems.length === 0 ? (
                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                      Занятий и подтверждённых броней нет.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {dayItems.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                        >
                          <p className="text-sm font-bold text-slate-800">
                            {item.start}–{item.end}
                          </p>

                          {role === "STUDENT" ? (
                            <p className="mt-1 text-xs text-slate-500">
                              Аудитория занята
                            </p>
                          ) : (
                            <p className="mt-1 text-xs leading-5 text-slate-600">
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

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
            <p className="text-sm font-bold text-slate-900">
              Перед отправкой
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Проверьте выбранную аудиторию, дату и время. После
              отправки заявка поступит преподавателю на рассмотрение.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
