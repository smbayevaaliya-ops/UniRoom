"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/classrooms", label: "Аудитории" },
  { href: "/schedule", label: "Расписание" },
  { href: "/book", label: "Бронирование" },
  { href: "/admin", label: "Администрирование" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-blue-900"
          onClick={() => setOpen(false)}
        >
          UniRoom
        </Link>

        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, item.href)
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Мобильная навигация"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    isActive(pathname, item.href) ? "page" : undefined
                  }
                  className={`block rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive(pathname, item.href)
                      ? "bg-blue-50 text-blue-900"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
