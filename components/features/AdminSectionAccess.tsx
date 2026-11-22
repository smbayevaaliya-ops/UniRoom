"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-store";
import AdminView from "@/components/features/AdminView";

type AdminTab = "requests" | "rooms" | "buildings";

type Props = {
  tab: AdminTab;
};

export default function AdminSectionAccess({ tab }: Props) {
  const role = useRole();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (role === "STUDENT") {
      router.replace("/");
      return;
    }

    if (
      role === "TEACHER" &&
      (tab === "rooms" || tab === "buildings")
    ) {
      router.replace("/admin");
    }
  }, [mounted, role, tab, router]);

  if (!mounted || role === "STUDENT") {
    return null;
  }

  if (
    role === "TEACHER" &&
    (tab === "rooms" || tab === "buildings")
  ) {
    return null;
  }

  return (
    <AdminView
      initialTab={tab}
      standalone
    />
  );
}