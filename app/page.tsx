
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-28 text-center">
          <span className="mb-6 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900">
            Университетская система бронирования
          </span>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-gray-900">
            Найди свободную аудиторию
            <span className="text-blue-800"> за пару кликов</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            UniRoom помогает студентам и преподавателям просматривать
            расписание, находить свободные аудитории и отправлять
            заявки на бронирование.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/classrooms"
              className="rounded-lg bg-blue-900 px-7 py-4 font-semibold text-white transition hover:bg-blue-800"
            >
              Посмотреть аудитории
            </Link>

            <Link
              href="/schedule"
              className="rounded-lg border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Посмотреть расписание
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            Возможности UniRoom
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 text-3xl">🏫</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Список аудиторий
              </h3>
              <p className="leading-7 text-gray-600">
                Просматривай аудитории, их вместимость и оборудование.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 text-3xl">📅</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Расписание
              </h3>
              <p className="leading-7 text-gray-600">
                Узнавай, какие аудитории заняты и какие свободны.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 text-3xl">📝</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Бронирование
              </h3>
              <p className="leading-7 text-gray-600">
                Отправляй заявки на бронирование аудиторий.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © 2026 UniRoom. Университетская система бронирования аудиторий.
      </footer>
    </div>
  );
}
