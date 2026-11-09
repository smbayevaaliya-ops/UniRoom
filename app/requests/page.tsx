"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useBookings } from "@/lib/stores";
import { useRole } from "@/lib/role-store";
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

  const [filter, setFilter] = useState("ALL");
  const [requester, setRequester] = useState("");

  const visibleBookings = useMemo(() => {
    let result = [...bookings];

    if (role === "STUDENT" && requester.trim()) {
      result = result.filter((booking) =>
        booking.requester
          .toLowerCase()
          .includes(requester.trim().toLowerCase()),
      );
    }

    if (filter !== "ALL") {
      result = result.filter(
        (booking) => booking.status === filter,
      );
    }

    return result.sort((a, b) => b.id - a.id);
  }, [bookings, filter, requester, role]);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;

  const approvedCount = bookings.filter(
    (booking) => booking.status === "APPROVED",
  ).length;

  const rejectedCount = bookings.filter(
    (booking) =>
      booking.status === "REJECTED" ||
      booking.status === "CANCELLED",
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {role === "STUDENT" ? "Мои заявки" : "Заявки на бронирование"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Статус и информация о бронировании аудиторий.
            </p>
          </div>

          <Link
            href="/book"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Новая заявка
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">На рассмотрении</p>
            <p className="mt-2 text-3xl font-bold">{pendingCount}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">Одобрено</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-gray-500">Отклонено / отменено</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>
        </div>

        {role === "STUDENT" && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Фильтр по ФИО заявителя
            </label>
            <input
              value={requester}
              onChange={(event) => setRequester(event.target.value)}
              placeholder="Введите ФИО, указанное в заявке"
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        )}

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
              <p className="font-medium">Заявок не найдено</p>
              <p className="mt-2 text-sm text-gray-500">
                Создайте новую заявку на бронирование аудитории.
              </p>
            </div>
          ) : (
            visibleBookings.map((booking) => (
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
                      {booking.date} · {booking.start}–{booking.end}
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
                    <span className="text-gray-500">Заявитель:</span>{" "}
                    {booking.requester}
                  </p>
                  <p>
                    <span className="text-gray-500">Цель:</span>{" "}
                    {booking.purpose}
                  </p>
                  {booking.comment && (
                    <p className="rounded-lg bg-gray-50 p-3">
                      <span className="font-medium">Комментарий:</span>{" "}
                      {booking.comment}
                    </p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}