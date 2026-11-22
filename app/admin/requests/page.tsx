import type { Metadata } from "next";
import AdminSectionAccess from "@/components/features/AdminSectionAccess";

export const metadata: Metadata = {
  title: "requests | UniRoom",
};

export default function Page() {
  return <AdminSectionAccess tab="requests" />;
}
