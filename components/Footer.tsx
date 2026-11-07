import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© 2026 UniRoom. Университетская система бронирования аудиторий.</p>
        <nav aria-label="Нижняя навигация" className="flex gap-4">
          <Link href="/classrooms" className="hover:text-slate-900">
            Аудитории
          </Link>
          <Link href="/schedule" className="hover:text-slate-900">
            Расписание
          </Link>
          <Link href="/book" className="hover:text-slate-900">
            Бронирование
          </Link>
        </nav>
      </div>
    </footer>
  );
}
