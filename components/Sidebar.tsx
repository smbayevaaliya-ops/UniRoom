"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useRole, setRole } from "@/lib/role-store";
import type { UserRole } from "@/lib/types";

const navigation = [
  { name: "Главная", href: "/" },
  { name: "Аудитории", href: "/classrooms" },
  { name: "Расписание", href: "/schedule" },
  { name: "Бронирование", href: "/book" },
  { name: "Мои заявки", href: "/requests" },
];

const roleNames: Record<UserRole, string> = {
  STUDENT: "Студент",
  TEACHER: "Преподаватель",
  ADMIN: "Администратор",
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const role = useRole();

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
      ? [{ name: "Админ-панель", href: "/admin" }]
      : []),
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть меню"
        className="fixed left-6 top-5 z-[70] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-800 shadow-sm"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <button
          aria-label="Закрыть меню"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/30"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-72 flex-col bg-[#111827] px-6 py-7 text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center gap-3 pl-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">
            U
          </div>

          <div>
            <p className="text-xl font-bold">UniRoom</p>
            <p className="text-xs text-slate-400">University workspace</p>
          </div>
        </div>

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Рабочее пространство
        </p>

        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="mb-2 text-xs text-slate-400">
              Текущая роль
            </p>

            <select
              value={role}
              onChange={(e) => changeRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-white/10 bg-[#1f2937] p-2 text-sm text-white outline-none"
            >
              <option value="STUDENT">Студент</option>
              <option value="TEACHER">Преподаватель</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="mt-3 flex items-center gap-3 rounded-xl bg-white/5 p-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold">
              П
            </div>

            <div>
              <p className="text-sm font-semibold">Пользователь</p>
              <p className="text-xs text-slate-400">
                {roleNames[role]}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}