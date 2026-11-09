"use client";

import { useMemo, useState } from "react";

import { BOOKING_STATUS_META } from "@/lib/constants";
import {
  useBookings,
  useRooms,
  useBuildings,
  useOccupations,
  updateBookingStatus,
  toggleRoomActive,
  resetDemoData,
  addRoom,
  updateRoom,
  deleteRoom,
  addBuilding,
  updateBuilding,
  deleteBuilding,
} from "@/lib/stores";
import { useRole } from "@/lib/role-store";
import { useToday } from "@/lib/use-today";
import type {
  BookingStatus,
  Classroom,
  Building,
} from "@/lib/types";

type Tab = "requests" | "rooms" | "buildings";

type RoomForm = {
  number: string;
  name: string;
  buildingId: string;
  floor: string;
  capacity: string;
  type: string;
  equipment: string;
  computerCount: string;
};

type BuildingForm = {
  name: string;
  floors: string;
  address: string;
};

const emptyRoomForm: RoomForm = {
  number: "",
  name: "",
  buildingId: "",
  floor: "1",
  capacity: "30",
  type: "Лекционная",
  equipment: "Проектор, Доска",
  computerCount: "0",
};

const emptyBuildingForm: BuildingForm = {
  name: "",
  floors: "1",
  address: "",
};

export default function AdminView() {
  const role = useRole();
  const isAdmin = role === "ADMIN";

  const bookings = useBookings();
  const rooms = useRooms();
  const buildings = useBuildings();
  const occupations = useOccupations();
  const today = useToday();

  const [activeTab, setActiveTab] = useState<Tab>("requests");

  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");

  const [editingBooking, setEditingBooking] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [commentAction, setCommentAction] = useState<
    "REJECTED" | "REVISION"
  >("REJECTED");

  const [roomForm, setRoomForm] = useState<RoomForm>(emptyRoomForm);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomError, setRoomError] = useState("");

  const [buildingForm, setBuildingForm] =
    useState<BuildingForm>(emptyBuildingForm);
  const [editingBuildingId, setEditingBuildingId] =
    useState<string | null>(null);
  const [buildingError, setBuildingError] = useState("");

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showBuildingForm, setShowBuildingForm] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState("all");

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => b.id - a.id),
    [bookings],
  );

  const filteredBookings = sortedBookings.filter(
    (booking) => filter === "ALL" || booking.status === filter,
  );

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === "PENDING" ||
      booking.status === "REVISION",
  ).length;

  const activeRooms = rooms.filter((room) => room.active).length;

  const totalCapacity = rooms.reduce(
    (sum, room) => sum + room.capacity,
    0,
  );

  const totalComputers = rooms.reduce(
    (sum, room) => sum + room.computerCount,
    0,
  );

  const todayOccupations = occupations.filter(
    (item) => item.date === today,
  );

  function getBuildingName(buildingId: string) {
    return (
      buildings.find((building) => building.id === buildingId)?.name ||
      "Корпус не найден"
    );
  }

  function changeStatus(
    id: number,
    status: BookingStatus,
    message?: string,
  ) {
    const result = updateBookingStatus(id, status, message);

    if (!result.ok) {
      alert(
        result.conflicts.length > 0
          ? "Нельзя одобрить заявку: время пересекается с другим занятием или бронированием."
          : "Не удалось изменить статус заявки.",
      );

      return false;
    }

    return true;
  }

  function openComment(
    id: number,
    action: "REJECTED" | "REVISION",
  ) {
    setEditingBooking(id);
    setComment("");
    setCommentAction(action);
  }

  function submitComment() {
    if (!comment.trim()) {
      alert("Напишите комментарий.");
      return;
    }

    if (editingBooking === null) return;

    const success = changeStatus(
      editingBooking,
      commentAction,
      comment.trim(),
    );

    if (success) {
      setEditingBooking(null);
      setComment("");
    }
  }

  function handleReset() {
    if (!isAdmin) return;

    if (
      confirm(
        "Все изменения аудиторий, корпусов и заявок будут потеряны. Продолжить?",
      )
    ) {
      resetDemoData();
      setShowRoomForm(false);
      setShowBuildingForm(false);
      setEditingRoomId(null);
      setEditingBuildingId(null);
    }
  }

  function openNewRoomForm() {
    setEditingRoomId(null);
    setRoomForm({
      ...emptyRoomForm,
      buildingId: buildings[0]?.id || "",
    });
    setRoomError("");
    setShowRoomForm(true);
  }

  function openEditRoomForm(room: Classroom) {
    setEditingRoomId(room.id);

    setRoomForm({
      number: room.number,
      name: room.name,
      buildingId: room.buildingId,
      floor: String(room.floor),
      capacity: String(room.capacity),
      type: room.type,
      equipment: room.equipment.join(", "),
      computerCount: String(room.computerCount),
    });

    setRoomError("");
    setShowRoomForm(true);
  }

  function saveRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const floor = Number(roomForm.floor);
    const capacity = Number(roomForm.capacity);
    const computerCount = Number(roomForm.computerCount);

    if (
      !roomForm.number.trim() ||
      !roomForm.name.trim() ||
      !roomForm.buildingId ||
      !roomForm.type.trim()
    ) {
      setRoomError("Заполните все обязательные поля.");
      return;
    }

    if (
      !Number.isInteger(floor) ||
      !Number.isInteger(capacity) ||
      !Number.isInteger(computerCount) ||
      floor < 1 ||
      capacity < 1 ||
      computerCount < 0
    ) {
      setRoomError("Проверьте этаж, вместимость и количество компьютеров.");
      return;
    }

    const building = buildings.find(
      (item) => item.id === roomForm.buildingId,
    );

    if (!building || floor > building.floors) {
      setRoomError("Выбранный этаж не существует в этом корпусе.");
      return;
    }

    const equipment = roomForm.equipment
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const roomData = {
      name: roomForm.name.trim(),
      buildingId: roomForm.buildingId,
      floor,
      capacity,
      type: roomForm.type.trim(),
      equipment,
      computerCount,
    };

    if (editingRoomId) {
      const result = updateRoom(editingRoomId, roomData);

      if (!result.ok) {
        setRoomError(result.message || "Не удалось изменить аудиторию.");
        return;
      }
    } else {
      const result = addRoom({
        ...roomData,
        number: roomForm.number.trim(),
        active: true,
      });

      if (!result.ok) {
        setRoomError(result.message || "Не удалось добавить аудиторию.");
        return;
      }
    }

    setShowRoomForm(false);
    setEditingRoomId(null);
    setRoomForm(emptyRoomForm);
    setRoomError("");
  }

  function handleDeleteRoom(room: Classroom) {
    if (
      !confirm(
        `Удалить аудиторию №${room.number} из корпуса ${getBuildingName(room.buildingId)}?`,
      )
    ) {
      return;
    }

    const result = deleteRoom(room.id);

    if (!result.ok) {
      alert(result.message || "Не удалось удалить аудиторию.");
    }
  }

  function openNewBuildingForm() {
    setEditingBuildingId(null);
    setBuildingForm(emptyBuildingForm);
    setBuildingError("");
    setShowBuildingForm(true);
  }

  function openEditBuildingForm(building: Building) {
    setEditingBuildingId(building.id);

    setBuildingForm({
      name: building.name,
      floors: String(building.floors),
      address: building.address,
    });

    setBuildingError("");
    setShowBuildingForm(true);
  }

  function saveBuilding(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const floors = Number(buildingForm.floors);

    if (!buildingForm.name.trim()) {
      setBuildingError("Укажите название корпуса.");
      return;
    }

    if (!Number.isInteger(floors) || floors < 1) {
      setBuildingError("Количество этажей должно быть положительным числом.");
      return;
    }

    const buildingData = {
      name: buildingForm.name.trim(),
      floors,
      address: buildingForm.address.trim(),
    };

    const result = editingBuildingId
      ? updateBuilding(editingBuildingId, buildingData)
      : addBuilding(buildingData);

    if (!result.ok) {
      setBuildingError(result.message || "Не удалось сохранить корпус.");
      return;
    }

    setShowBuildingForm(false);
    setEditingBuildingId(null);
    setBuildingForm(emptyBuildingForm);
    setBuildingError("");
  }

  function handleDeleteBuilding(building: Building) {
    if (
      !confirm(
        `Удалить ${building.name}?`,
      )
    ) {
      return;
    }

    const result = deleteBuilding(building.id);

    if (!result.ok) {
      alert(result.message || "Не удалось удалить корпус.");
    }
  }

  function handleToggleRoom(roomId: string) {
    if (!isAdmin) return;

    toggleRoomActive(roomId);
  }

  const visibleRooms = rooms.filter(
    (room) =>
      selectedBuilding === "all" ||
      room.buildingId === selectedBuilding,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Всего заявок</p>
            <p className="mt-1 text-2xl font-bold">
              {bookings.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">На рассмотрении</p>
            <p className="mt-1 text-2xl font-bold">
              {pendingCount}
            </p>
          </div>

          {isAdmin && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">
                Активные аудитории
              </p>
              <p className="mt-1 text-2xl font-bold">
                {activeRooms} / {rooms.length}
              </p>
            </div>
          )}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Сбросить демо-данные
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">Корпуса</p>
            <p className="mt-1 text-2xl font-bold">
              {buildings.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">Общая вместимость</p>
            <p className="mt-1 text-2xl font-bold">
              {totalCapacity}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">
              Компьютеры во всех аудиториях
            </p>
            <p className="mt-1 text-2xl font-bold">
              {totalComputers}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            activeTab === "requests"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Заявки
        </button>

        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab("rooms")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                activeTab === "rooms"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Аудитории
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("buildings")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                activeTab === "buildings"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Корпуса
            </button>
          </>
        )}
      </div>

      {activeTab === "requests" && (
        <div className="space-y-4">
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "ALL" | BookingStatus)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
          >
            <option value="ALL">Все заявки</option>
            <option value="PENDING">На рассмотрении</option>
            <option value="APPROVED">Одобренные</option>
            <option value="REVISION">На доработке</option>
            <option value="REJECTED">Отклонённые</option>
            <option value="CANCELLED">Отменённые</option>
          </select>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Заявитель</th>
                  <th className="p-4">Аудитория</th>
                  <th className="p-4">Дата и время</th>
                  <th className="p-4">Цель</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((item) => {
                  const room = rooms.find(
                    (currentRoom) =>
                      currentRoom.id === item.roomId,
                  );

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100"
                    >
                      <td className="p-4 font-medium">
                        {item.requester}
                      </td>

                      <td className="p-4">
                        {item.room}

                        <p className="mt-1 text-xs text-slate-500">
                          {room
                            ? `${getBuildingName(room.buildingId)}, этаж ${room.floor}`
                            : item.buildingId
                              ? getBuildingName(item.buildingId)
                              : "Корпус не указан"}
                        </p>
                      </td>

                      <td className="p-4">
                        {item.date}
                        <br />
                        {item.start}–{item.end}
                      </td>

                      <td className="p-4">{item.purpose}</td>

                      <td className="p-4">
                        <span className="font-medium">
                          {BOOKING_STATUS_META[item.status].label}
                        </span>

                        {item.comment && (
                          <p className="mt-1 max-w-48 text-xs text-slate-500">
                            {item.comment}
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        {item.status === "PENDING" ||
                        item.status === "REVISION" ? (
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(item.id, "APPROVED")
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs text-white"
                            >
                              Одобрить
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openComment(item.id, "REVISION")
                              }
                              className="rounded-lg bg-amber-500 px-3 py-2 text-xs text-white"
                            >
                              На доработку
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openComment(item.id, "REJECTED")
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs text-white"
                            >
                              Отклонить
                            </button>
                          </div>
                        ) : item.status === "APPROVED" ? (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(item.id, "CANCELLED")
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                          >
                            Отменить
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Обработана
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400"
                    >
                      Заявок нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isAdmin && activeTab === "rooms" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <select
              value={selectedBuilding}
              onChange={(event) =>
                setSelectedBuilding(event.target.value)
              }
              className="rounded-xl border bg-white px-4 py-2 text-sm"
            >
              <option value="all">Все корпуса</option>

              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={openNewRoomForm}
              disabled={buildings.length === 0}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              + Добавить аудиторию
            </button>
          </div>

          {showRoomForm && (
            <form
              onSubmit={saveRoom}
              className="space-y-4 rounded-2xl border bg-white p-5"
            >
              <h3 className="text-lg font-bold">
                {editingRoomId
                  ? "Редактирование аудитории"
                  : "Новая аудитория"}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Номер аудитории

                  <input
                    required
                    disabled={editingRoomId !== null}
                    value={roomForm.number}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        number: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3 disabled:bg-slate-100"
                  />
                </label>

                <label className="text-sm">
                  Название

                  <input
                    required
                    value={roomForm.name}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        name: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="text-sm">
                  Корпус

                  <select
                    value={roomForm.buildingId}
                    disabled={editingRoomId !== null}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        buildingId: event.target.value,
                        floor: "1",
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3 disabled:bg-slate-100"
                  >
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  Этаж

                  <select
                    value={roomForm.floor}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        floor: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  >
                    {Array.from(
                      {
                        length:
                          buildings.find(
                            (item) =>
                              item.id === roomForm.buildingId,
                          )?.floors || 1,
                      },
                      (_, index) => index + 1,
                    ).map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  Вместимость

                  <input
                    type="number"
                    min="1"
                    required
                    value={roomForm.capacity}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        capacity: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="text-sm">
                  Тип аудитории

                  <input
                    required
                    value={roomForm.type}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        type: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="text-sm">
                  Количество компьютеров

                  <input
                    type="number"
                    min="0"
                    required
                    value={roomForm.computerCount}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        computerCount: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="text-sm sm:col-span-2">
                  Оборудование

                  <input
                    value={roomForm.equipment}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        equipment: event.target.value,
                      })
                    }
                    placeholder="Проектор, Доска, Компьютеры"
                    className="mt-1 w-full rounded-xl border p-3"
                  />

                  <span className="mt-1 block text-xs text-slate-500">
                    Перечисляйте оборудование через запятую.
                  </span>
                </label>
              </div>

              {editingRoomId && (
                <p className="text-xs text-slate-500">
                  Номер и корпус нельзя изменить, чтобы не нарушить
                  связи с существующими занятиями и заявками.
                </p>
              )}

              {roomError && (
                <p className="text-sm text-red-600">{roomError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm text-white"
                >
                  Сохранить
                </button>

                <button
                  type="button"
                  onClick={() => setShowRoomForm(false)}
                  className="rounded-xl border px-5 py-2 text-sm"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleRooms.map((room) => (
              <div
                key={room.id}
                className="rounded-2xl border bg-white p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">
                    Аудитория {room.number}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      room.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.active ? "Активна" : "Отключена"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {room.name}
                </p>

                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>{getBuildingName(room.buildingId)}</p>
                  <p>Этаж: {room.floor}</p>
                  <p>Вместимость: {room.capacity}</p>
                  <p>Тип: {room.type}</p>
                  <p>Компьютеры: {room.computerCount}</p>
                  <p>
                    Оборудование:{" "}
                    {room.equipment.join(", ") || "Не указано"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEditRoomForm(room)}
                    className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    Изменить
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRoom(room.id)}
                    className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    {room.active ? "Отключить" : "Включить"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRoom(room)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}

            {visibleRooms.length === 0 && (
              <p className="text-sm text-slate-500">
                В выбранном корпусе пока нет аудиторий.
              </p>
            )}
          </div>
        </div>
      )}

      {isAdmin && activeTab === "buildings" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openNewBuildingForm}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Добавить корпус
            </button>
          </div>

          {showBuildingForm && (
            <form
              onSubmit={saveBuilding}
              className="space-y-4 rounded-2xl border bg-white p-5"
            >
              <h3 className="text-lg font-bold">
                {editingBuildingId
                  ? "Редактирование корпуса"
                  : "Новый корпус"}
              </h3>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm">
                  Название корпуса

                  <input
                    required
                    value={buildingForm.name}
                    onChange={(event) =>
                      setBuildingForm({
                        ...buildingForm,
                        name: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="text-sm">
                  Количество этажей

                  <input
                    type="number"
                    min="1"
                    required
                    value={buildingForm.floors}
                    onChange={(event) =>
                      setBuildingForm({
                        ...buildingForm,
                        floors: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="text-sm">
                  Адрес

                  <input
                    value={buildingForm.address}
                    onChange={(event) =>
                      setBuildingForm({
                        ...buildingForm,
                        address: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>
              </div>

              {buildingError && (
                <p className="text-sm text-red-600">
                  {buildingError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm text-white"
                >
                  Сохранить
                </button>

                <button
                  type="button"
                  onClick={() => setShowBuildingForm(false)}
                  className="rounded-xl border px-5 py-2 text-sm"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {buildings.map((building) => {
              const buildingRooms = rooms.filter(
                (room) => room.buildingId === building.id,
              );

              const activeBuildingRooms = buildingRooms.filter(
                (room) => room.active,
              );

              const capacity = buildingRooms.reduce(
                (sum, room) => sum + room.capacity,
                0,
              );

              const computers = buildingRooms.reduce(
                (sum, room) => sum + room.computerCount,
                0,
              );

              const occupiedToday = new Set(
                todayOccupations
                  .filter((item) =>
                    buildingRooms.some(
                      (room) => room.id === item.roomId,
                    ),
                  )
                  .map((item) => item.roomId),
              ).size;

              return (
                <div
                  key={building.id}
                  className="rounded-2xl border bg-white p-5"
                >
                  <h3 className="text-xl font-bold">
                    {building.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {building.address || "Адрес не указан"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Этажи
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {building.floors}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Аудитории
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {buildingRooms.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Активные
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {activeBuildingRooms.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Вместимость
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {capacity}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Компьютеры
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {computers}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Заняты сегодня
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {occupiedToday}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditBuildingForm(building)}
                      className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      Изменить
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBuilding(building)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })}

            {buildings.length === 0 && (
              <p className="text-sm text-slate-500">
                Корпусов пока нет.
              </p>
            )}
          </div>
        </div>
      )}

      {editingBooking !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold">
              {commentAction === "REJECTED"
                ? "Причина отклонения"
                : "Комментарий для доработки"}
            </h3>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Напишите комментарий..."
              className="mt-4 min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={submitComment}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}