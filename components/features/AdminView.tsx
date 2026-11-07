"use client";

import { useMemo, useState } from "react";
import { describeOccupation } from "@/lib/availability";
import { BOOKING_STATUS_META } from "@/lib/constants";
import {
  resetDemoData,
  toggleRoomActive,
  updateBookingStatus,
  useBookings,
  useOccupations,
  useRooms,
} from "@/lib/stores";
import { formatDateShort } from "@/lib/time";
import { useToday } from "@/lib/use-today";
import type { BookingStatus } from "@/lib/types";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectField } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/StatCard";
import { Table, THead, Td, Th, Tr } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";

type TabId = "requests" | "rooms";

export default function AdminView() {
  const bookings = useBookings();
  const rooms = useRooms();
  const occupations = useOccupations();
  const today = useToday();

  const [tab, setTab] = useState<TabId>("requests");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [notice, setNotice] = useState<{
    tone: "danger" | "success";
    title: string;
    details?: string[];
  } | null>(null);

  const pending = bookings.filter((item) => item.status === "PENDING").length;
  const activeRooms = rooms.filter((room) => room.active).length;

  const visibleBookings = useMemo(
    () =>
      bookings
        .filter((item) => statusFilter === "all" || item.status === statusFilter)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) || a.start.localeCompare(b.start),
        ),
    [bookings, statusFilter],
  );

  function changeStatus(id: number, status: BookingStatus) {
    const result = updateBookingStatus(id, status);
    if (!result.ok) {
      setNotice({
        tone: "danger",
        title: `Заявку №${id} нельзя одобрить: аудитория уже занята`,
        details: result.conflicts.map(describeOccupation),
      });
      return;
    }
    setNotice({
      tone: "success",
      title: `Статус заявки №${id}: ${BOOKING_STATUS_META[status].label}`,
    });
  }

  function handleReset() {
    if (
      window.confirm(
        "Вернуть демонстрационные заявки и аудитории к исходному состоянию? Внесённые изменения будут потеряны.",
      )
    ) {
      resetDemoData();
      setNotice({ tone: "success", title: "Демонстрационные данные восстановлены." });
    }
  }

  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Всего аудиторий" value={rooms.length} />
        <StatCard label="Доступны для бронирования" value={activeRooms} tone="success" />
        <StatCard label="Заявки на рассмотрении" value={pending} tone="warning" />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <Tabs
          label="Разделы администрирования"
          value={tab}
          onChange={setTab}
          items={[
            { id: "requests", label: "Заявки", count: bookings.length },
            { id: "rooms", label: "Аудитории", count: rooms.length },
          ]}
        />
        <Button variant="secondary" size="sm" onClick={handleReset}>
          Сбросить демо-данные
        </Button>
      </div>

      {notice && (
        <div className="mb-6">
          <Alert tone={notice.tone} title={notice.title}>
            {notice.details && (
              <ul className="list-disc pl-5">
                {notice.details.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </Alert>
        </div>
      )}

      {tab === "requests" && (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">
              Заявки на бронирование
            </h2>
            <div className="w-full sm:w-56">
              <SelectField
                label="Статус"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | BookingStatus)
                }
              >
                <option value="all">Все статусы</option>
                {(Object.keys(BOOKING_STATUS_META) as BookingStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {BOOKING_STATUS_META[status].label}
                    </option>
                  ),
                )}
              </SelectField>
            </div>
          </div>

          {visibleBookings.length === 0 ? (
            <EmptyState
              title="Заявок нет"
              description="Заявки с выбранным статусом отсутствуют."
            />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>№</Th>
                  <Th>Заявитель</Th>
                  <Th>Аудитория</Th>
                  <Th>Дата и время</Th>
                  <Th>Цель</Th>
                  <Th>Статус</Th>
                  <Th>Действия</Th>
                </tr>
              </THead>
              <tbody>
                {visibleBookings.map((item) => {
                  const meta = BOOKING_STATUS_META[item.status];
                  return (
                    <Tr key={item.id}>
                      <Td>{item.id}</Td>
                      <Td className="font-medium text-slate-900">
                        {item.requester}
                      </Td>
                      <Td>{item.room}</Td>
                      <Td className="whitespace-nowrap">
                        {formatDateShort(item.date)}, {item.start}–{item.end}
                      </Td>
                      <Td>{item.purpose}</Td>
                      <Td>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </Td>
                      <Td>
                        {item.status === "PENDING" ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => changeStatus(item.id, "APPROVED")}
                            >
                              Одобрить
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => changeStatus(item.id, "REJECTED")}
                            >
                              Отклонить
                            </Button>
                          </div>
                        ) : item.status === "APPROVED" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => changeStatus(item.id, "CANCELLED")}
                          >
                            Отменить
                          </Button>
                        ) : (
                          <span className="text-slate-400">Обработана</span>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      {tab === "rooms" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const todayCount = today
              ? occupations.filter(
                  (item) => item.room === room.number && item.date === today,
                ).length
              : 0;
            return (
              <Card key={room.number} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {room.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">{room.type}</p>
                  </div>
                  <Badge tone={room.active ? "success" : "neutral"}>
                    {room.active ? "Активна" : "Отключена"}
                  </Badge>
                </div>
                <p className="mt-4 text-sm text-slate-700">
                  Вместимость: {room.capacity} чел.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Записей на сегодня: {todayCount}
                </p>
                <div className="mt-5">
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => toggleRoomActive(room.number)}
                  >
                    {room.active
                      ? "Отключить от бронирования"
                      : "Включить для бронирования"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
