import { isISODate, todayISO } from "@/lib/time";
import { WORKDAY_START, WORKDAY_END } from "@/lib/constants";

export type BookingFormValues = {
  requester: string;
  room: string;
  date: string;
  start: string;
  end: string;
  purpose: string;
};

export type BookingFormErrors = Partial<
  Record<keyof BookingFormValues, string>
>;

export function validateInterval(
  start: string,
  end: string,
): string | undefined {
  if (!start || !end) {
    return "Укажите время начала и окончания.";
  }

  if (start >= end) {
    return "Время окончания должно быть позже времени начала.";
  }

  if (start < WORKDAY_START || end > WORKDAY_END) {
    return "Выбранное время находится за пределами рабочего дня.";
  }

  return undefined;
}

export function validateBookingForm(
  values: BookingFormValues,
  bookableRooms: string[],
): BookingFormErrors {
  const errors: BookingFormErrors = {};

  const requester = values.requester.trim();

  if (requester.length < 2) {
    errors.requester = "Укажите имя (не короче 2 символов).";
  } else if (requester.length > 80) {
    errors.requester = "Имя не должно превышать 80 символов.";
  }

  if (!values.room) {
    errors.room = "Выберите аудиторию.";
  } else if (!bookableRooms.includes(values.room)) {
    errors.room = "Эта аудитория недоступна для бронирования.";
  }

  if (!isISODate(values.date)) {
    errors.date = "Укажите корректную дату.";
  } else if (values.date < todayISO()) {
    errors.date = "Нельзя бронировать на прошедшую дату.";
  }

  const intervalError = validateInterval(values.start, values.end);

  if (intervalError) {
    errors.end = intervalError;
  }

  const purpose = values.purpose.trim();

  if (purpose.length < 5) {
    errors.purpose = "Опишите цель бронирования (не короче 5 символов).";
  } else if (purpose.length > 200) {
    errors.purpose = "Цель не должна превышать 200 символов.";
  }

  return errors;
}