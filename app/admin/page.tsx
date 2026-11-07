"use client";

import { useEffect, useState } from "react";
import { rooms, lessons } from "@/lib/universityData";

type BookingRequest = {
  id: number;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  people: string;
  status: string;
  createdAt: string;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("uniroom_requests") || "[]"
    );
    setRequests(saved);
  }, []);

  const updateStatus = (id: number, status: string) => {
    const updated = requests.map((request) =>
      request.id === id ? { ...request, status } : request
    );

    setRequests(updated);
    localStorage.setItem("uniroom_requests", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-700">
            ПАНЕЛЬ УПРАВЛЕНИЯ
          </p>

          <h1 className="text-3xl font-semibold text-slate-900">
            Администрирование
          </h1>

          <p className="mt-2 text-slate-500">
            Статистика помещений и управление заявками.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Всего аудиторий", value: rooms.length },
            { title: "Всего занятий", value: lessons.length },
            { title: "Всего заявок", value: requests.length },
            {
              title: "Ожидают решения",
              value: requests.filter(
                (r) => r.status === "На рассмотрении"
              ).length,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="text-sm text-slate-500">{item.title}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-lg font-semibold">Управление заявками</h2>
            <p className="mt-1 text-sm text-slate-500">
              Рассматривайте заявки и изменяйте их статус.
            </p>
          </div>

          {requests.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Аудитория {request.room}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {request.date} · {request.startTime}–{request.endTime}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Участников: {request.people}
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {request.purpose}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Статус: {request.status}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(request.id, "Одобрена")}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Одобрить
                    </button>

                    <button
                      onClick={() => updateStatus(request.id, "Отклонена")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Отклонить
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(request.id, "На рассмотрении")
                      }
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Вернуть
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-slate-500">
              Заявок пока нет.
            </div>
          )}
        </div>
      </div>
    </main>
  );
