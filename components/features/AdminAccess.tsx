"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-store";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import AdminView from "@/components/features/AdminView";
import AdminDashboard from "@/components/features/AdminDashboard";

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

  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";

  return (
    <PageContainer>
      <PageHeader
        title={
          isAdmin
            ? "Панель администратора"
            : "Заявки для рассмотрения"
        }
        description={
          isAdmin
            ? "Обзор системы и управление ресурсами университета."
            : "Просматривайте назначенные вам заявки и принимайте решения по бронированию."
        }
      />

      {isAdmin ? <AdminDashboard /> : <AdminView />}
    </PageContainer>
  );
}