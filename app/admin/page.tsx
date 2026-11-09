import type { Metadata } from "next";
import AdminAccess from "@/components/features/AdminAccess";

export const metadata: Metadata = {
  title: "Администрирование",
};

export default function AdminPage() {
  return <AdminAccess />;
}