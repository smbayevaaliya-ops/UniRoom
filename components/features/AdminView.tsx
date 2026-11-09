"use client";

import { useMemo, useState } from "react";
import { describeOccupation } from "@/lib/availability";
import { BOOKING_STATUS_META } from "@/lib/constants";
import { useBookings, useRooms, updateBookingStatus, toggleRoomActive, resetDemoData } from "@/lib/stores";
import type { BookingStatus } from "@/lib/types";

export default function AdminView() {
  const bookings = useBookings();
  const rooms = useRooms();

  const [activeTab, setActiveTab] = useState<"requests" | "rooms">("requests");
  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [editingBooking, setEditingBooking] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [commentAction, setCommentAction] = useState<"REJECTED" | "REVISION">("REJECTED");

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => b.id - a.id),
    [bookings],
  );

  const filteredBookings = sortedBookings.filter(
    (booking) => filter === "ALL" || booking.status === filter,
  );

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING" || booking.status === "REVISION",
  ).length;

  function changeStatus(
    id: number,
    status: BookingStatus,
    message?: string,
  ) {
    const result = updateBookingStatus(id, status, message);

    if (!result.ok) {
      alert(
        "Нельзя одобрить заявку: время пересекается с другим занятием или бронированием.",
      );
      return false;
    }

    return true;
  }

  function openComment(id: number, action: "REJECTED" | "REVISION") {
    setEditingBooking(id);
    setComment("");
    setCommentAction(action);
  }

  function submitComment() {
    if (!comment.trim()) {
      alert("Напишите комментарий.");
      return;
    }

    if (editingBooking === null) return;

    const success = changeStatus(
      editingBooking,
      commentAction,
      comment,
    );

    if (success) {
      setEditingBooking(null);
      setComment("");
    }
  }

  function handleReset() {
    if (confirm("Вернуть демонстрационные данные?")) {
      resetDemoData();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Заявок на рассмотрении: {pendingCount}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Сбросить демо-данные
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("requests")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            activeTab === "requests"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Заявки
        </button>

        <button
          onClick={() => setActiveTab("rooms")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            activeTab === "rooms"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Аудитории
        </button>
      </div>

      {activeTab === "requests" && (
        <div className="space-y-4">
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "ALL" | BookingStatus)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
          >
            <option value="ALL">Все заявки</option>
            <option value="PENDING">На рассмотрении</option>
            <option value="APPROVED">Одобренные</option>
            <option value="REVISION">На доработке</option>
            <option value="REJECTED">Отклонённые</option>
            <option value="CANCELLED">Отменённые</option>
          </select>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Заявитель</th>
                  <th className="p-4">Аудитория</th>
                  <th className="p-4">Дата и время</th>
                  <th className="p-4">Цель</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="p-4 font-medium">{item.requester}</td>
                    <td className="p-4">{item.room}</td>
                    <td className="p-4">
                      {item.date}
                      <br />
                      {item.start}–{item.end}
                    </td>
                    <td className="p-4">{item.purpose}</td>
                    <td className="p-4">
                      <span className="font-medium">
                        {BOOKING_STATUS_META[item.status].label}
                      </span>
                      {item.comment && (
                        <p className="mt-1 max-w-48 text-xs text-slate-500">
                          {item.comment}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      {item.status === "PENDING" ||
                      item.status === "REVISION" ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => changeStatus(item.id, "APPROVED")}
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs text-white"
                          >
                            Одобрить
                          </button>
                          <button
                            onClick={() => openComment(item.id, "REVISION")}
                            className="rounded-lg bg-amber-500 px-3 py-2 text-xs text-white"
                          >
                            На доработку
                          </button>
                          <button
                            onClick={() => openComment(item.id, "REJECTED")}
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs text-white"
                          >
                            Отклонить
                          </button>
                        </div>
                      ) : item.status === "APPROVED" ? (
                        <button
                          onClick={() => changeStatus(item.id, "CANCELLED")}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                        >
                          Отменить
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Обработана
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Заявок нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "rooms" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.number}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Аудитория {room.number}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    room.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.active ? "Активна" : "Отключена"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">{room.name}</p>
              <p className="mt-1 text-sm">Вместимость: {room.capacity}</p>
              <p className="mt-1 text-sm">Тип: {room.type}</p>

              <button
                onClick={() => toggleRoomActive(room.number)}
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
              >
                {room.active ? "Отключить" : "Включить"}
              </button>
            </div>
          ))}
        </div>
      )}

      {editingBooking !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold">
              {commentAction === "REJECTED"
                ? "Причина отклонения"
                : "Комментарий для доработки"}
            </h3>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Напишите комментарий..."
              className="mt-4 min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingBooking(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                Отмена
              </button>

              <button
                onClick={submitComment}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}