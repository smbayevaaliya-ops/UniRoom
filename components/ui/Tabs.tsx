"use client";

export type TabItem<T extends string> = { id: T; label: string; count?: number };

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1"
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              selected
                ? "bg-blue-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={`ml-2 ${selected ? "text-blue-200" : "text-slate-400"}`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
