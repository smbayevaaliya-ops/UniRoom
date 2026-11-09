import type { BookingStatus, Tone } from "@/lib/types";

export const WORKDAY_START = "08:00";
export const WORKDAY_END = "20:00";

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; tone: Tone }
> = {
  PENDING: { label: "На рассмотрении", tone: "warning" },
  APPROVED: { label: "Одобрена", tone: "success" },
  REJECTED: { label: "Отклонена", tone: "danger" },
  CANCELLED: { label: "Отменена", tone: "neutral" },
  REVISION: { label: "На доработке", tone: "info" },
};