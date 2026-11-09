"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-store";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import AdminView from "@/components/features/AdminView";

export default function AdminAccess() {
  const role = useRole();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && role === "STUDENT") {
      router.replace("/");
    }
  }, [mounted, role, router]);

  if (!mounted || role === "STUDENT") {
    return null;
  }

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