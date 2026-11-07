import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    step: "01",
    title: "Список аудиторий",
    text: "Просматривайте аудитории, их вместимость и оборудование.",
    href: "/classrooms",
    cta: "Открыть список",
  },
  {
    step: "02",
    title: "Расписание",
    text: "Узнавайте, какие аудитории заняты и какие свободны в нужное время.",
    href: "/schedule",
    cta: "Открыть расписание",
  },
  {
    step: "03",
    title: "Бронирование",
    text: "Отправляйте заявки на бронирование и избегайте пересечений с занятиями.",
    href: "/book",
    cta: "Подать заявку",
  },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-6 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-900">
            Университетская система бронирования
          </span>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Найдите свободную аудиторию{" "}
            <span className="text-blue-800">за пару кликов</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            UniRoom помогает студентам и преподавателям просматривать
            расписание, находить свободные аудитории и отправлять заявки на
            бронирование.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/classrooms" className="px-7 py-3">
              Посмотреть аудитории
            </ButtonLink>
            <ButtonLink href="/schedule" variant="secondary" className="px-7 py-3">
              Посмотреть расписание
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Возможности UniRoom
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.step} className="flex flex-col p-7">
              <span className="text-sm font-semibold text-blue-800">
                {feature.step}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 flex-1 leading-7 text-slate-600">
                {feature.text}
              </p>
              <div className="mt-6">
                <ButtonLink href={feature.href} variant="secondary" size="sm">
                  {feature.cta}
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
