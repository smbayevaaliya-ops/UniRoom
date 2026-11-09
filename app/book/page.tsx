import { Suspense } from "react";
import BookingForm from "@/components/features/BookingForm";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center text-slate-500">
            Загрузка формы бронирования...
          </div>
        }
      >
        <BookingForm />
      </Suspense>
    </main>
  );
}