import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "@/components/features/BookingForm";
import { Card } from "@/components/ui/Card";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Бронирование аудитории" };

export default function BookPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Бронирование аудитории"
        description="Укажите аудиторию, дату и время. Система проверит, что аудитория не занята."
      />
      <Suspense
        fallback={
          <Card className="p-6">
            <p className="text-sm text-slate-500">Загрузка формы…</p>
          </Card>
        }
      >
        <BookingForm />
      </Suspense>
    </PageContainer>
  );
}
