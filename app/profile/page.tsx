import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Мой профиль",
};

export default function ProfilePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Мой профиль"
        description="Информация о вашем аккаунте UniRoom."
      />

      <Card className="max-w-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            П
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Пользователь
            </h2>
            <p className="text-sm text-slate-500">Студент</p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}