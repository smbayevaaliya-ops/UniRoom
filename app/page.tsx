
import Link from "next/link";

const stats = [
  { label: "Всего аудиторий", value: "48", note: "В университете" },
  { label: "Свободно сейчас", value: "16", note: "Доступны для занятий" },
  { label: "Занято", value: "32", note: "По текущему расписанию" },
  { label: "Мои заявки", value: "03", note: "Ожидают рассмотрения" },
];

const rooms = [
  { number: "101", type: "Лекционная", capacity: "30 мест", building: "Корпус A", status: "Свободна" },
  { number: "204", type: "Учебная", capacity: "20 мест", building: "Корпус A", status: "Занята" },
  { number: "305", type: "Лекционная", capacity: "40 мест", building: "Корпус B", status: "Свободна" },
];

const activities = [
  { time: "09:00", title: "Основы программирования", room: "Аудитория 204", status: "Занятие" },
  { time: "11:00", title: "Базы данных", room: "Аудитория 305", status: "Занятие" },
  { time: "14:00", title: "Свободное время", room: "Аудитория 101", status: "Свободно" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] px-6 pb-12 pt-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1440px]">

        <header className="mb-10 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-center">
          <div className="pl-14 md:pl-14">
            <p className="text-sm font-medium text-slate-500">UNIVERSITY WORKSPACE</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Обзор
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Управление аудиториями и учебным пространством
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">Личный кабинет</p>
              <p className="text-xs text-slate-500">Студент</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700">
              U
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-2xl bg-[#172b4d] p-7 text-white md:p-9">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Система аудиторного пространства
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Найдите подходящее пространство для занятий
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Проверяйте доступность помещений, изучайте расписание
              и отправляйте заявки на бронирование в одном месте.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/classrooms" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#172b4d] transition hover:bg-blue-50">
                Найти аудиторию
              </Link>
              <Link href="/schedule" className="rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Открыть расписание
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Аудитории</h2>
                <p className="mt-1 text-sm text-slate-500">Текущая доступность помещений</p>
              </div>
              <Link href="/classrooms" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                Все аудитории →
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {rooms.map((room, index) => (
                <div key={room.number} className={`flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center ${index !== rooms.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <div>
                    <p className="font-semibold text-slate-900">Аудитория {room.number}</p>
                    <p className="mt-1 text-sm text-slate-500">{room.type} · {room.capacity} · {room.building}</p>
                  </div>
                  <span className={`w-fit rounded-md px-3 py-1.5 text-xs font-semibold ${room.status === "Свободна" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {room.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Расписание на сегодня</h2>
              <p className="mt-1 text-sm text-slate-500">Пример учебной активности</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              {activities.map((activity, index) => (
                <div key={activity.time} className="flex gap-4">
                  <div className="w-14 shrink-0 pt-1 text-sm font-semibold text-slate-500">
                    {activity.time}
                  </div>
                  <div className={`relative flex-1 pb-6 ${index !== activities.length - 1 ? "border-l border-slate-200 pl-5" : "pl-5"}`}>
                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{activity.room}</p>
                    <p className="mt-2 text-xs font-medium text-blue-700">{activity.status}</p>
                  </div>
                </div>
              ))}
              <Link href="/schedule" className="mt-2 block rounded-lg border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Полное расписание
              </Link>
            </div>
          </section>
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-400">
          UniRoom · University Workspace · 2026
        </footer>
      </div>
    </main>
  );
}

