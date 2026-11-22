import Link from "next/link";

const features = [
  {
    number: "01",
    icon: "▦",
    title: "Аудитории",
    description:
      "Изучайте доступные помещения, вместимость и оборудование университета.",
    href: "/classrooms",
    label: "Все аудитории",
  },
  {
    number: "02",
    icon: "◷",
    title: "Расписание",
    description:
      "Проверяйте занятость помещений и планируйте время без пересечений.",
    href: "/schedule",
    label: "Открыть расписание",
  },
  {
    number: "03",
    icon: "↗",
    title: "Бронирование",
    description:
      "Оставляйте заявки на подходящее время и отслеживайте их статус.",
    href: "/book",
    label: "Забронировать",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <section className="relative overflow-hidden bg-[#101a32] text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
              University space management
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Пространство
              <br />
              для новых
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                возможностей.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              UniRoom — единое пространство для поиска аудиторий,
              просмотра расписания и удобного бронирования помещений
              университета.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="group inline-flex items-center gap-3 rounded-xl bg-blue-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition duration-300 hover:-translate-y-1 hover:bg-blue-400"
              >
                Забронировать аудиторию
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/classrooms"
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/10"
              >
                Исследовать аудитории
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-1 text-xs text-slate-400">
                  Доступ к системе
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">Единая</p>
                <p className="mt-1 text-xs text-slate-400">
                  Система бронирования
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">Удобно</p>
                <p className="mt-1 text-xs text-slate-400">
                  Планирование времени
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-cyan-300/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    UN IROOM / WORKSPACE
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Ваш университет
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-xl font-bold shadow-lg shadow-blue-500/30">
                  U
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#172541] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    Пространство для работы
                  </span>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Online
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.06] p-4">
                    <span className="text-2xl text-cyan-300">▦</span>
                    <p className="mt-4 text-sm font-semibold">
                      Аудитории
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Поиск помещений
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.06] p-4">
                    <span className="text-2xl text-blue-300">◷</span>
                    <p className="mt-4 text-sm font-semibold">
                      Расписание
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Контроль времени
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center gap-4 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-xl">
                      ↗
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Умное бронирование
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Управление заявками в одном месте
                      </p>
                    </div>
                    <span className="ml-auto text-xl text-blue-300">
                      →
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 px-1">
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#182642] bg-blue-500 text-xs font-semibold">
                    S
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#182642] bg-cyan-600 text-xs font-semibold">
                    T
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#182642] bg-indigo-500 text-xs font-semibold">
                    A
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Студенты · Преподаватели · Администраторы
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-24">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Возможности платформы
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Всё необходимое.
              <br />
              В одном пространстве.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-500">
            Управляйте университетскими помещениями проще.
            Находите нужную аудиторию и планируйте своё время
            с помощью UniRoom.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.number}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.2em] text-slate-400">
                  {feature.number}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  {feature.icon}
                </span>
              </div>

              <h3 className="mt-8 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 min-h-20 text-sm leading-7 text-slate-500">
                {feature.description}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-sm font-semibold text-blue-700">
                  {feature.label}
                </span>
                <span className="text-lg text-blue-600 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-[#2346a8] px-8 py-10 text-white shadow-xl shadow-blue-900/10 sm:px-12 sm:py-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                UniRoom
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Начните с удобного пространства.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100">
                Выберите аудиторию, проверьте расписание и отправьте
                заявку на бронирование.
              </p>
            </div>

            <Link
              href="/book"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-blue-700 transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
            >
              Перейти к бронированию
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
