import { Card } from "@/components/ui/Card";
import type { Tone } from "@/lib/types";

const valueTones: Record<Tone, string> = {
  neutral: "text-slate-900",
  info: "text-blue-900",
  success: "text-emerald-700",
  danger: "text-red-700",
  warning: "text-amber-700",
};

export function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: Tone;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueTones[tone]}`}>{value}</p>
    </Card>
  );
}
