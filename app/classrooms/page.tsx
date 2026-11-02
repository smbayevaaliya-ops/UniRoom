
const classrooms = [
  {
    number: "101",
    name: "Аудитория 101",
    capacity: 30,
    type: "Лекционная",
    equipment: ["Проектор", "Доска", "Компьютеры"],
    status: "Свободна",
  },
  {
    number: "204",
    name: "Аудитория 204",
    capacity: 20,
    type: "Учебная",
    equipment: ["Проектор", "Доска"],
    status: "Занята",
  },
  {
    number: "305",
    name: "Аудитория 305",
    capacity: 40,
    type: "Лекционная",
    equipment: ["Проектор", "Компьютеры"],
    status: "Свободна",
  },
  {
    number: "412",
    name: "Аудитория 412",
    capacity: 15,
    type: "Компьютерный класс",
    equipment: ["Компьютеры", "Проектор"],
    status: "Свободна",
  },
  {
    number: "508",
    name: "Аудитория 508",
    capacity: 25,
    type: "Учебная",
    equipment: ["Доска", "Проектор"],
    status: "Занята",
  },
  {
    number: "601",
    name: "Аудитория 601",
    capacity: 35,
    type: "Лекционная",
    equipment: ["Проектор", "Доска"],
    status: "Свободна",
  },
];

export default function ClassroomsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <a href="/" className="text-sm text-blue-800 hover:underline">
            ← На главную
          </a>

          <h1 className="mt-5 text-4xl font-bold text-gray-900">
            Аудитории
          </h1>

          <p className="mt-3 text-gray-600">
            Выбирайте подходящую аудиторию для занятий и мероприятий.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
            Свободные аудитории
          </span>
          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800">
            Занятые аудитории
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((room) => (
            <div
              key={room.number}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  🏫
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    room.status === "Свободна"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {room.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {room.type}
              </p>

              <div className="mt-5 flex items-center gap-2 text-gray-700">
                <span>👥</span>
                <span>Вместимость: {room.capacity} человек</span>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Оборудование:
                </p>

                <div className="flex flex-wrap gap-2">
                  {room.equipment.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                disabled={room.status === "Занята"}
                className="mt-6 w-full rounded-xl bg-blue-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {room.status === "Свободна"
                  ? "Забронировать"
                  : "Недоступна"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
