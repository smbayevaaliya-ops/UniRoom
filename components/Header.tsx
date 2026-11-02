
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          UniRoom
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/">Главная</Link>
          <Link href="/classrooms">Аудитории</Link>
          <Link href="/schedule">Расписание</Link>
        </nav>

        <Link
          href="/login"
          className="rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Войти
        </Link>
      </div>
    </header>
  );
}
