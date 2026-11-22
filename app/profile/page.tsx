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

      <Card className="max-w-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {initials || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {displayName}
            </h2>
            <p className="text-sm text-slate-500">{roleName}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
          <div>
            <p className="text-sm text-slate-500">Роль аккаунта</p>
            <p className="font-medium text-slate-900">{roleName}</p>
          </div>

          {role === "TEACHER" && (
            <div>
              <p className="text-sm text-slate-500">ID преподавателя</p>
              <p className="font-medium text-slate-900">
                {teacherId || "Не выбран"}
              </p>
            </div>
          )}

          {role === "STUDENT" && !studentName && (
            <p className="text-sm text-amber-700">
              Укажите имя в форме бронирования, чтобы оно отображалось в профиле.
            </p>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}