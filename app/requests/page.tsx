"use client";

import { useEffect, useState } from "react";

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

export default function RequestsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("uniroom_requests") || "[]"
    );
    setRequests(saved);
  }, []);

  const statusStyle = (status: string) => {
    if (status === "Одобрена") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Отклонена") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-700">
            УПРАВЛЕНИЕ ЗАЯВКАМИ
          </p>

          <h1 className="text-3xl font-semibold text-slate-900">
            Мои заявки
          </h1>

          <p className="mt-2 text-slate-500">
            История отправленных заявок на бронирование.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Всего заявок</p>
            <p className="mt-2 text-3xl font-semibold">{requests.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">На рассмотрении</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">
              {requests.filter((r) => r.status === "На рассмотрении").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Одобрено</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">
              {requests.filter((r) => r.status === "Одобрена").length}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {requests.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">
                      Аудитория {request.room}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Дата: {request.date}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Время: {request.startTime}–{request.endTime}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Участников: {request.people}
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      {request.purpose}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-medium ${statusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <h2 className="text-lg font-medium text-slate-800">
                Заявок пока нет
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Отправленные заявки появятся здесь.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}