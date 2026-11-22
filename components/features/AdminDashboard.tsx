"use client";

import Link from "next/link";
import {
  useBookings,
  useRooms,
  useBuildings,
} from "@/lib/stores";
import { BOOKING_STATUS_META } from "@/lib/constants";

export default function AdminDashboard() {
  const bookings = useBookings();
  const rooms = useRooms();
  const buildings = useBuildings();

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "PENDING" ||
      booking.status === "REVISION",
  );

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED",
  );

  const activeRooms = rooms.filter((room) => room.active);

  const recentBookings = [...bookings]
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : a.id;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : b.id;

      return dateB - dateA;
    })
    .slice(0, 5);

  const attentionBookings = pendingBookings.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Обзор системы
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Основная информация о заявках, корпусах и аудиториях.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Всего заявок</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">
            Требуют рассмотрения
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-800">
            {pendingBookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">
            Одобренные заявки
          </p>
          <p className="mt-2 text-3xl font-bold text-green-800">
            {approvedBookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Активные аудитории
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {activeRooms.length} / {rooms.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Корпуса
          </p>
          <p className="mt-2 text-2xl font-bold">
            {buildings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Всего аудиторий
          </p>
          <p className="mt-2 text-2xl font-bold">
            {rooms.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h3 className="font-bold text-slate-900">
                Последние заявки
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Недавно созданные заявки студентов
              </p>
            </div>

            <Link
              href="/admin/requests"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Все заявки →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {booking.requester}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Аудитория {booking.room} · {booking.date}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {BOOKING_STATUS_META[booking.status].label}
                </span>
              </div>
            ))}

            {recentBookings.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">
                Заявок пока нет.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h3 className="font-bold text-slate-900">
                Требуют внимания
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Заявки, ожидающие решения преподавателя
              </p>
            </div>

            <Link
              href="/admin/requests"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Посмотреть →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {attentionBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {booking.requester}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Аудитория {booking.room} · {booking.date}
                  </p>
                </div>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {BOOKING_STATUS_META[booking.status].label}
                </span>
              </div>
            ))}

            {attentionBookings.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">
                Нет заявок, требующих внимания.
              </p>
            )}
          </div>
        </section>
      </div>

      <section>
        <h3 className="mb-3 font-bold text-slate-900">
          Управление системой
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/requests"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h4 className="font-semibold text-slate-900">
              Заявки
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Просмотр всех заявок и их статусов.
            </p>
            <span className="mt-4 block text-sm font-medium text-blue-600">
              Перейти →
            </span>
          </Link>

          <Link
            href="/admin/rooms"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h4 className="font-semibold text-slate-900">
              Аудитории
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Просмотр и управление аудиториями.
            </p>
            <span className="mt-4 block text-sm font-medium text-blue-600">
              Перейти →
            </span>
          </Link>

          <Link
            href="/admin/buildings"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h4 className="font-semibold text-slate-900">
              Корпуса
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Просмотр и управление корпусами.
            </p>
            <span className="mt-4 block text-sm font-medium text-blue-600">
              Перейти →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}