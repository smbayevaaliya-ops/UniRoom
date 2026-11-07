import type { Metadata } from "next";
import ScheduleView from "@/components/features/ScheduleView";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Расписание" };

export default function SchedulePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Расписание аудиторий"
        description="Просматривайте занятия и одобренные брони, находите свободные аудитории."
      />
      <ScheduleView />
    </PageContainer>
  );
}
