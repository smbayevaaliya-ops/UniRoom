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
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-700",
  REVISION: "bg-orange-100 text-orange-800",
};

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
      if (!studentName) {
        return [];
      }

      return bookings.filter(
        (booking) =>
          booking.requester.trim().toLowerCase() ===
          studentName.toLowerCase(),
      );
    }

    if (role === "TEACHER") {
      if (!teacherId) {
        return [];
      }

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
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {pageTitle}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Статус и информация о бронировании аудиторий.
            </p>
          </div>

          {role === "STUDENT" && (
            <Link
              href="/book"
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Новая заявка
            </Link>
          )}
        </div>

        {role === "TEACHER" && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              {selectedTeacher
                ? `Вы вошли как преподаватель: ${selectedTeacher.name}. Здесь отображаются только назначенные вам заявки.`
                : "Выберите преподавателя в боковом меню, чтобы увидеть назначенные ему заявки."}
            </p>
          </div>
        )}

        {role === "STUDENT" && !studentName && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              Чтобы увидеть свои заявки, сначала создайте заявку
              и укажите своё ФИО.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              На рассмотрении
            </p>

            <p className="mt-2 text-3xl font-bold">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Одобрено
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Отклонено / отменено
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["ALL", "Все"],
            ["PENDING", "На рассмотрении"],
            ["APPROVED", "Одобрены"],
            ["REJECTED", "Отклонены"],
            ["REVISION", "На доработке"],
            ["CANCELLED", "Отменены"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                filter === value
                  ? "bg-blue-600 text-white"
                  : "border bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visibleBookings.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center">
              <p className="font-medium">
                Заявок не найдено
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {filter === "ALL"
                  ? emptyDescription
                  : "Нет заявок с выбранным статусом."}
              </p>
            </div>
          ) : (
            visibleBookings.map((booking) => {
              const assignedTeacher = teachers.find(
                (teacher) =>
                  teacher.id === booking.teacherId,
              );

              return (
                <article
                  key={booking.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">
                        Аудитория №{booking.room}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.date} · {booking.start}–
                        {booking.end}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">
                        Заявитель:
                      </span>{" "}
                      {booking.requester}
                    </p>

                    {assignedTeacher && (
                      <p>
                        <span className="text-gray-500">
                          Преподаватель:
                        </span>{" "}
                        {assignedTeacher.name}
                      </p>
                    )}

                    <p>
                      <span className="text-gray-500">
                        Цель:
                      </span>{" "}
                      {booking.purpose}
                    </p>

                    {booking.comment && (
                      <p className="rounded-lg bg-gray-50 p-3">
                        <span className="font-medium">
                          Комментарий:
                        </span>{" "}
                        {booking.comment}
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}