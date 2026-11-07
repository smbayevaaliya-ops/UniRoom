"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { describeOccupation, findConflicts, getRoomDay } from "@/lib/availability";
import { WORKDAY_END, WORKDAY_START } from "@/lib/constants";
import { addBooking, useOccupations, useRooms } from "@/lib/stores";
import { formatDate } from "@/lib/time";
import { useToday } from "@/lib/use-today";
import {
  validateBookingForm,
  validateInterval,
  type BookingFormErrors,
  type BookingFormValues,
} from "@/lib/validation";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";

export default function BookingForm() {
  const params = useSearchParams();
  const today = useToday();
  const rooms = useRooms();
  const occupations = useOccupations();

  const [values, setValues] = useState<BookingFormValues>({
    requester: "",
    room: params.get("room") ?? "",
    date: params.get("date") ?? "",
    start: params.get("start") ?? "10:00",
    end: params.get("end") ?? "12:00",
    purpose: "",
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [serverConflicts, setServerConflicts] = useState<string[]>([]);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const date = values.date || today;
  const bookable = useMemo(() => rooms.filter((room) => room.active), [rooms]);

  const intervalError = validateInterval(values.start, values.end);
  const liveConflicts = useMemo(
    () =>
      values.room && date && !intervalError
        ? findConflicts(occupations, {
            room: values.room,
            date,
            start: values.start,
            end: values.end,
          })
        : [],
    [occupations, values.room, date, values.start, values.end, intervalError],
  );
  const dayItems = useMemo(
    () => (values.room && date ? getRoomDay(occupations, values.room, date) : []),
    [occupations, values.room, date],
  );

  function update<K extends keyof BookingFormValues>(
    key: K,
    value: BookingFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerConflicts([]);
    setCreatedId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const candidate = { ...values, date };
    const found = validateBookingForm(
      candidate,
      bookable.map((room) => room.number),
    );
    setErrors(found);
    setCreatedId(null);
    if (Object.keys(found).length > 0) return;

    const result = addBooking({
      requester: candidate.requester.trim(),
      room: candidate.room,
      date: candidate.date,
      start: candidate.start,
      end: candidate.end,
      purpose: candidate.purpose.trim(),
    });

    if (!result.ok) {
      setServerConflicts(result.conflicts.map(describeOccupation));
      return;
    }

    setServerConflicts([]);
    setCreatedId(result.booking.id);
    setValues((current) => ({ ...current, purpose: "" }));
  }

  if (!date) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-500">Загрузка формы…</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {createdId !== null && (
            <Alert tone="success" title={`Заявка №${createdId} отправлена`}>
              Текущий статус: «На рассмотрении». Администратор рассмотрит её в
              панели администрирования.
            </Alert>
          )}

          {serverConflicts.length > 0 && (
            <Alert tone="danger" title="Аудитория занята в это время">
              <ul className="list-disc pl-5">
                {serverConflicts.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Alert>
          )}

          <TextField
            label="Имя заявителя"
            autoComplete="name"
            placeholder="Например, Иван Петров"
            value={values.requester}
            error={errors.requester}
            onChange={(event) => update("requester", event.target.value)}
          />

          <SelectField
            label="Аудитория"
            value={values.room}
            error={errors.room}
            onChange={(event) => update("room", event.target.value)}
          >
            <option value="">Выберите аудиторию</option>
            {bookable.map((room) => (
              <option key={room.number} value={room.number}>
                {room.name} ({room.type}, {room.capacity} чел.)
              </option>
            ))}
          </SelectField>

          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              label="Дата"
              type="date"
              min={today}
              value={date}
              error={errors.date}
              onChange={(event) => update("date", event.target.value)}
            />
            <TextField
              label="Начало"
              type="time"
              min={WORKDAY_START}
              max={WORKDAY_END}
              value={values.start}
              onChange={(event) => update("start", event.target.value)}
            />
            <TextField
              label="Окончание"
              type="time"
              min={WORKDAY_START}
              max={WORKDAY_END}
              value={values.end}
              error={errors.end}
              onChange={(event) => update("end", event.target.value)}
            />
          </div>

          <TextAreaField
            label="Цель бронирования"
            rows={4}
            maxLength={200}
            placeholder="Например, дополнительное занятие со студентами"
            value={values.purpose}
            error={errors.purpose}
            hint={`${values.purpose.length} / 200`}
            onChange={(event) => update("purpose", event.target.value)}
          />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={liveConflicts.length > 0}>
              Отправить заявку
            </Button>
            <ButtonLink href="/classrooms" variant="secondary">
              Выбрать другую аудиторию
            </ButtonLink>
          </div>
        </form>
      </Card>

      <Card className="h-fit p-6">
        <h2 className="text-lg font-bold text-slate-900">Доступность</h2>
        {!values.room ? (
          <p className="mt-3 text-sm text-slate-500">
            Выберите аудиторию, чтобы увидеть её занятость на {formatDate(date)}.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {intervalError ? (
              <Alert tone="warning">{intervalError}</Alert>
            ) : liveConflicts.length > 0 ? (
              <Alert tone="danger" title="В выбранное время аудитория занята">
                Измените время или выберите другую аудиторию.
              </Alert>
            ) : (
              <Alert tone="success" title="В выбранное время аудитория свободна" />
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Занятость на {formatDate(date)}
              </p>
              {dayItems.length === 0 ? (
                <p className="mt-1.5 text-sm text-slate-500">
                  Занятий и броней нет.
                </p>
              ) : (
                <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                  {dayItems.map((item) => (
                    <li key={item.id}>{describeOccupation(item)}</li>
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
