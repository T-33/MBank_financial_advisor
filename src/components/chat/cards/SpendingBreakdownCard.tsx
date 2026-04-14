"use client";
import { BarChart3 } from "lucide-react";
import { formatSomCompact } from "@/lib/format";

type Category = { label: string; value: number; percent: number; color: string };
type Props = { periodLabel: string; total: number; topCategory: string; categories: Category[] };

export default function SpendingBreakdownCard({ periodLabel, total, topCategory, categories }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#ECECEC] p-4 max-w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-900 leading-tight">{periodLabel}</p>
          <p className="text-[11px] text-slate-500">Топ: {topCategory}</p>
        </div>
        <p className="ml-auto text-[15px] font-bold text-slate-900">{formatSomCompact(total)}</p>
      </div>

      {/* Segmented bar */}
      <div className="h-[7px] rounded-full overflow-hidden flex gap-[2px] mb-2">
        {categories.map((c, i) => (
          <div
            key={c.label}
            style={{
              width: `${c.percent}%`,
              background: c.color,
              borderRadius: i === 0 ? "4px 0 0 4px" : i === categories.length - 1 ? "0 4px 4px 0" : "0",
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-1.5 mt-3">
        {categories.map((c) => (
          <div key={c.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span className="text-[12px] text-slate-600">{c.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">{c.percent}%</span>
              <span className="text-[12px] font-semibold text-slate-900">{formatSomCompact(c.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
