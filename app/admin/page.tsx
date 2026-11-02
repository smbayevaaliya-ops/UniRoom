
"use client";

import { useState } from "react";
import Header from "@/components/Header";

type Request = {
  id: number;
  name: string;
  room: string;
  date: string;
  time: string;
  purpose: string;
  status: "На рассмотрении" | "Одобрена" | "Отклонена";
};

const initialRequests: Request[] = [
  {
    id: 1,
    name: "Иван Петров",
    room: "101",
    date: "2026-11-02",
    time: "10:00–12:00",
    purpose: "Дополнительное занятие",
    status: "На рассмотрении",
  },
  {
    id: 2,
    name: "Анна Сидорова",
    room: "204",
    date: "2026-11-03",
    time: "12:00–14:00",
    purpose: "Научная встреча",
    status: "На рассмотрении",
  },
  {
    id: 3,
    name: "Дмитрий Иванов",
    room: "305",
    date: "2026-11-04",
    time: "14:00–16:00",
    purpose: "Работа над проектом",
    status: "Одобрена",
  },
];

const initialRooms = [
  { number: "101", capacity: 30, type: "Лекционная", status: "Свободна" },
  { number: "204", capacity: 20, type: "Учебная", status: "Занята" },
  { number: "305", capacity: 40, type: "Лекционная", status: "Свободна" },
  { number: "412", capacity: 15, type: "Компьютерный класс", status: "Свободна" },
  { number: "508", capacity: 25, type: "Учебная", status: "Занята" },
  { number: "601", capacity: 35, type: "Лекционная", status: "Свободна" },
];

export default function AdminPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [rooms, setRooms] = useState(initialRooms);
  const [activeTab, setActiveTab] = useState("requests");

  const updateRequest = (id: number, status: Request["status"]) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const toggleRoom = (number: string) => {
    setRooms((current) =>
      current.map((room) =>
        room.number === number
          ? {
              ...room,
              status: room.status === "Свободна" ? "Занята" : "Свободна",
            }
          : room
      )
    );
  };

  const pendingCount = requests.filter(
    (request) => request.status === "На рассмотрении"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-800">
            UniRoom
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Панель администратора
          </h1>
          <p className="mt-2 text-slate-500">
            Управление аудиториями и заявками на бронирование.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Всего аудиторий</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {rooms.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Свободные аудитории</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {rooms.filter((room) => room.status === "Свободна").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Заявки на рассмотрении</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setActiveTab("requests")}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${
              activeTab === "requests"
                ? "bg-blue-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Заявки
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${
              activeTab === "rooms"
                ? "bg-blue-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Аудитории
          </button>
        </div>

        {activeTab === "requests" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Заявки на бронирование
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Пользователь</th>
                    <th className="px-5 py-4">Аудитория</th>
                    <th className="px-5 py-4">Дата</th>
                    <th className="px-5 py-4">Время</th>
                    <th className="px-5 py-4">Цель</th>
                    <th className="px-5 py-4">Статус</th>
                    <th className="px-5 py-4">Действия</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-t border-slate-100">
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {request.name}
                      </td>
                      <td className="px-5 py-4">{request.room}</td>
                      <td className="px-5 py-4">{request.date}</td>
                      <td className="px-5 py-4">{request.time}</td>
                      <td className="px-5 py-4">{request.purpose}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === "Одобрена"
                              ? "bg-green-100 text-green-700"
                              : request.status === "Отклонена"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {request.status === "На рассмотрении" ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                updateRequest(request.id, "Одобрена")
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() =>
                                updateRequest(request.id, "Отклонена")
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Отклонить
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">Обработана</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Управление аудиториями
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div
                  key={room.number}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    Аудитория № {room.number}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Вместимость: {room.capacity} человек
                  </p>
                  <p className="text-sm text-slate-500">{room.type}</p>

                  <p
                    className={`mt-3 text-sm font-semibold ${
                      room.status === "Свободна"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {room.status}
                  </p>

                  <button
                    onClick={() => toggleRoom(room.number)}
                    className="mt-4 w-full rounded-lg border border-blue-900 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
                  >
                    Изменить статус
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
