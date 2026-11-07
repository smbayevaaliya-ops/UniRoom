
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Главная", href: "/" },
  { name: "Аудитории", href: "/classrooms" },
  { name: "Расписание", href: "/schedule" },
  { name: "Бронирование", href: "/book" },
  { name: "Мои заявки", href: "/requests" },
  { name: "Админ-панель", href: "/admin" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть меню"
        className="fixed left-6 top-5 z-[70] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-800 shadow-sm transition hover:bg-slate-50"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <button
          aria-label="Закрыть меню"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 cursor-default bg-slate-950/30"
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
          {navigation.map((item) => {
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
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
              П
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                Пользователь
              </p>
              <p className="text-xs text-slate-400">Студент</p>
            </div>

            <span className="text-slate-400">›</span>
          </Link>

          <p className="mt-4 text-center text-xs text-slate-500">
            UniRoom · University workspace
          </p>
        </div>
      </aside>
    </>
  );
}
