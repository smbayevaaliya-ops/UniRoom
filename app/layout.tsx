import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "UniRoom — бронирование аудиторий",
    template: "%s | UniRoom",
  },
  description:
    "UniRoom — университетская система просмотра расписания, поиска свободных аудиторий и подачи заявок на бронирование.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable + " h-full antialiased"}>
      <body className="flex min-h-full flex-col">
        <Sidebar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}