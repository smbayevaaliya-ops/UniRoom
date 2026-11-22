"use client";

import { useEffect, useState } from "react";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { useRole, useTeacherId } from "@/lib/role-store";
import { teachers } from "@/lib/data/teachers";

export default function ProfilePage() {
  const role = useRole();
  const teacherId = useTeacherId();
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    setStudentName(
      localStorage.getItem("uniroom.student-name.v1")?.trim() || ""
    );
  }, []);

  const teacher = teachers.find((item) => item.id === teacherId);

  const roleName =
    role === "ADMIN"
      ? "Администратор"
      : role === "TEACHER"
        ? "Преподаватель"
        : "Студент";

  const displayName =
    role === "ADMIN"
      ? "Администратор UniRoom"
      : role === "TEACHER"
        ? teacher?.name || "Преподаватель"
        : studentName || "Имя не указано";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title="Мой профиль"
        description="Информация о вашем аккаунте UniRoom."
      />

      <div className="grid max-w-4xl gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white p-0 shadow-sm lg:col-span-2">
          <div className="relative overflow-hidden bg-[#101d3a] px-6 py-8 text-white sm:px-8">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-blue-400 to-indigo-600 text-3xl font-bold text-white shadow-xl shadow-blue-950/30">
                {initials || "U"}
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Аккаунт UniRoom
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-blue-100/75">
                  {roleName}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Информация об аккаунте
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Основные данные вашего профиля.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Роль аккаунта
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {roleName}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 20a8 8 0 0 1 16 0"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {role === "TEACHER" && (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      ID преподавателя
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {teacherId || "Не выбран"}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="3"
                      />
                      <path
                        d="M8 9h8M8 13h8M8 17h4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {role === "STUDENT" && !studentName && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <span className="text-xl">ⓘ</span>
                    <div>
                      <p className="font-semibold text-amber-900">
                        Имя пока не указано
                      </p>
                      <p className="mt-1 text-sm leading-5 text-amber-800">
                        Укажите имя в форме бронирования, чтобы оно
                        отображалось в профиле.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Ваше пространство
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              UniRoom помогает управлять бронированием аудиторий
              и получать актуальную информацию о расписании.
            </p>
          </Card>

          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              UniRoom
            </p>

            <p className="mt-3 text-lg font-bold leading-snug text-slate-900">
              Всё необходимое для удобного управления аудиториями.
            </p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}