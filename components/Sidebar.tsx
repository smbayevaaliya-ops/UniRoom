"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useRole,
  setRole,
  useTeacherId,
  setTeacherId,
} from "@/lib/role-store";
import { teachers } from "@/lib/data/teachers";
import type { UserRole } from "@/lib/types";

const navigation = [
  { name: "Главная", href: "/", icon: "⌂" },
  { name: "Аудитории", href: "/classrooms", icon: "▦" },
  { name: "Расписание", href: "/schedule", icon: "◷" },
  { name: "Бронирование", href: "/book", icon: "＋" },
  { name: "Мои заявки", href: "/requests", icon: "▤" },
];

const roleNames: Record<UserRole, string> = {
  STUDENT: "Студент",
  TEACHER: "Преподаватель",
  ADMIN: "Администратор",
};

function isUserRole(value: string): value is UserRole {
  return (
    value === "STUDENT" ||
    value === "TEACHER" ||
    value === "ADMIN"
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const storedRole = useRole();
  const role: UserRole = isUserRole(storedRole)
    ? storedRole
    : "STUDENT";

  const teacherId = useTeacherId();

  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === teacherId,
  );

  const changeRole = (newRole: UserRole) => {
    setRole(newRole);

    if (newRole === "STUDENT" && pathname === "/admin") {
      router.push("/");
    }

    setIsOpen(false);
  };

  const items = [
    ...navigation,
    ...(role !== "STUDENT"
      ? [{ name: "Админ-панель", href: "/admin", icon: "⌘" }]
      : []),
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        className={`fixed left-5 top-5 z-[70] flex h-12 w-12 items-center justify-center rounded-2xl border text-xl shadow-lg backdrop-blur-xl transition duration-300 ${
          isOpen
            ? "border-white/10 bg-[#172541] text-white"
            : "border-slate-200/80 bg-white/90 text-slate-800 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <button
          aria-label="Закрыть меню"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-[#071225]/50 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[300px] flex-col overflow-y-auto border-r border-white/10 bg-[#101a32] px-5 py-7 text-white shadow-[20px_0_60px_rgba(15,23,42,0.25)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center gap-3 pl-14">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xl font-extrabold text-white shadow-lg shadow-blue-500/30">
            U
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight">
              UniRoom
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              University workspace
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Рабочее пространство
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-cyan-300" />
                )}

                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-white/[0.05] text-slate-400 group-hover:bg-white/10 group-hover:text-cyan-300"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>

                {active && (
                  <span className="ml-auto text-sm text-blue-100">
                    ●
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Ваше пространство
          </p>

          <p className="mt-3 text-sm font-semibold text-white">
            Всё под контролем
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Аудитории, расписание и заявки в одной системе.
          </p>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="mb-3 flex items-center gap-2 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Настройки пользователя
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="mb-3 text-xs font-medium text-slate-400">
              Текущая роль
            </p>

            <select
              value={role}
              onChange={(event) => {
                const value = event.target.value;

                if (isUserRole(value)) {
                  changeRole(value);
                }
              }}
              className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#1b2944] px-3 py-3 text-sm font-medium text-white outline-none transition focus:border-blue-400"
            >
              <option value="STUDENT">Студент</option>
              <option value="TEACHER">Преподаватель</option>
              <option value="ADMIN">Администратор</option>
            </select>

            {role === "TEACHER" && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-400">
                  Выберите преподавателя
                </p>

                <select
                  value={teacherId}
                  onChange={(event) =>
                    setTeacherId(event.target.value)
                  }
                  className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#1b2944] px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400"
                >
                  <option value="">Не выбран</option>

                  {teachers.map((teacher) => (
                    <option
                      key={teacher.id}
                      value={teacher.id}
                    >
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className={`mt-3 flex items-center gap-3 rounded-2xl border p-3 transition ${
              pathname === "/profile"
                ? "border-blue-400/30 bg-blue-500/15"
                : "border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-950/30">
              {role === "TEACHER"
                ? selectedTeacher?.name.charAt(0) || "П"
                : role === "ADMIN"
                  ? "А"
                  : "П"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {role === "TEACHER"
                  ? selectedTeacher?.name || "Преподаватель"
                  : role === "ADMIN"
                    ? "Администратор"
                    : "Пользователь"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {roleNames[role]}
              </p>
            </div>

            <span className="text-lg text-slate-500">→</span>
          </Link>

          <p className="mt-5 text-center text-[10px] tracking-wider text-slate-600">
            UNIROOM © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
