"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useBookings } from "@/lib/stores";
import { useRole, useTeacherId } from "@/lib/role-store";
import { teachers } from "@/lib/data/teachers";
import type { BookingStatus } from "@/lib/types";

const statusLabels: Record<BookingStatus, string> = {
  PENDING: "На рассмотрении",
  APPROVED: "Одобрена",
  REJECTED: "Отклонена",
  CANCELLED: "Отменена",
  REVISION: "На доработке",
};

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
  REVISION: "border-orange-200 bg-orange-50 text-orange-700",
};

const filters = [
  ["ALL", "Все"],
  ["PENDING", "На рассмотрении"],
  ["APPROVED", "Одобрены"],
  ["REJECTED", "Отклонены"],
  ["REVISION", "На доработке"],
  ["CANCELLED", "Отменены"],
];

export default function RequestsPage() {
  const bookings = useBookings();
  const role = useRole();
  const teacherId = useTeacherId();

  const [filter, setFilter] = useState("ALL");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    if (role === "STUDENT") {
      const savedName =
        localStorage.getItem("uniroom.student-name.v1") || "";

      setStudentName(savedName.trim());
    }
  }, [role]);

  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === teacherId,
  );

  const roleBookings = useMemo(() => {
    if (role === "STUDENT") {
      if (!studentName) return [];

      return bookings.filter(
        (booking) =>
          booking.requester.trim().toLowerCase() ===
          studentName.toLowerCase(),
      );
    }

    if (role === "TEACHER") {
      if (!teacherId) return [];

      return bookings.filter(
        (booking) => booking.teacherId === teacherId,
      );
    }

    return bookings;
  }, [bookings, role, studentName, teacherId]);

  const visibleBookings = useMemo(() => {
    let result = [...roleBookings];

    if (filter !== "ALL") {
      result = result.filter(
        (booking) => booking.status === filter,
      );
    }

    return result.sort((a, b) => b.id - a.id);
  }, [roleBookings, filter]);

  const pendingCount = roleBookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;

  const approvedCount = roleBookings.filter(
    (booking) => booking.status === "APPROVED",
  ).length;

  const rejectedCount = roleBookings.filter(
    (booking) =>
      booking.status === "REJECTED" ||
      booking.status === "CANCELLED",
  ).length;

  const pageTitle =
    role === "STUDENT"
      ? "Мои заявки"
      : role === "TEACHER"
        ? "Назначенные мне заявки"
        : "Все заявки на бронирование";

  const emptyDescription =
    role === "STUDENT"
      ? "Здесь будут отображаться ваши заявки на бронирование аудиторий."
      : role === "TEACHER"
        ? "Вам пока не назначено ни одной заявки."
        : "В системе пока нет заявок на бронирование.";

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-7 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">

        <section className="relative overflow-hidden rounded-[30px] bg-[#101d3a] px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Система бронирования UniRoom
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {pageTitle}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/75 sm:text-base">
                Отслеживайте состояние заявок, информацию о бронировании
                и решения по использованию аудиторий.
              </p>
            </div>

            {role === "STUDENT" && (
              <Link
                href="/book"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#17264a] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <span className="text-lg">+</span>
                Новая заявка
              </Link>
            )}
          </div>
        </section>

        {role === "TEACHER" && (
          <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
              i
            </div>
            <div>
              <p className="font-semibold text-blue-900">
                Информация для преподавателя
              </p>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                {selectedTeacher
                  ? `Вы вошли как преподаватель: ${selectedTeacher.name}. Здесь отображаются только назначенные вам заявки.`
                  : "Выберите преподавателя в боковом меню, чтобы увидеть назначенные ему заявки."}
              </p>
            </div>
          </div>
        )}

        {role === "STUDENT" && !studentName && (
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg text-amber-700">
              !
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                Пока нет данных о заявителе
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Чтобы увидеть свои заявки, сначала создайте заявку
                и укажите своё ФИО.
              </p>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                На рассмотрении
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">
                ◷
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {pendingCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ожидают решения
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Одобрено
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                ✓
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">
              {approvedCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Успешные бронирования
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Отклонено / отменено
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg text-red-600">
                ×
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-red-600">
              {rejectedCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Завершённые заявки
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">
              Фильтр заявок
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Выберите статус для просмотра
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-[#1d4ed8] text-white shadow-md shadow-blue-600/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Список бронирований
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Заявки
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {visibleBookings.length} найдено
            </span>
          </div>

          {visibleBookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                ▤
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Заявок не найдено
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {filter === "ALL"
                  ? emptyDescription
                  : "Нет заявок с выбранным статусом."}
              </p>

              {role === "STUDENT" && filter === "ALL" && (
                <Link
                  href="/book"
                  className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Создать заявку
                </Link>
              )}
            </div>
          ) : (
            visibleBookings.map((booking) => {
              const assignedTeacher = teachers.find(
                (teacher) => teacher.id === booking.teacherId,
              );

              return (
                <article
                  key={booking.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                        №
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Заявка №{booking.id}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          Аудитория №{booking.room}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {booking.date} · {booking.start}–{booking.end}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>

                  <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Заявитель
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-slate-800">
                          {booking.requester}
                        </p>
                      </div>

                      {assignedTeacher && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Преподаватель
                          </p>
                          <p className="mt-1.5 text-sm font-semibold text-slate-800">
                            {assignedTeacher.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Цель бронирования
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-700">
                        {booking.purpose}
                      </p>
                    </div>
                  </div>

                  {booking.comment && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Комментарий
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {booking.comment}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
