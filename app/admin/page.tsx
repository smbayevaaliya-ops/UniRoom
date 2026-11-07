import type { Metadata } from "next";
import AdminView from "@/components/features/AdminView";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Администрирование" };

export default function AdminPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Панель администратора"
        description="Управление аудиториями и заявками на бронирование."
      />
      <AdminView />
    </PageContainer>
  );
}
