import type { Metadata } from "next";
import ClassroomsView from "@/components/features/ClassroomsView";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Аудитории" };

export default function ClassroomsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Аудитории"
        description="Выберите дату и время, чтобы увидеть, какие аудитории свободны, и подайте заявку на бронирование."
      />
      <ClassroomsView />
    </PageContainer>
  );
}
