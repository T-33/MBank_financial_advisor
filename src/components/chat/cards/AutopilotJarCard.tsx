"use client";
import { PiggyBank, Coins, ShieldOff, TrendingDown } from "lucide-react";
import { formatSomCompact } from "@/lib/format";

type History = { reason: string; amount: number; dateISO: string; note: string };
type Props = {
  total: number;
  apr: number;
  goal: { name: string; target: number; aiReason: string };
  progressPct: number;
  sources: Record<string, number>;
  recentHistory: History[];
};

export default function AutopilotJarCard({ total, apr, goal, progressPct, sources, recentHistory }: Props) {
  const recentSum = recentHistory.reduce((s, h) => s + h.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#ECECEC] p-4 max-w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
          <PiggyBank className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-slate-900 leading-tight">AI-Копилка · {goal.name}</p>
          <p className="text-[11px] text-slate-400 truncate">{goal.aiReason}</p>
        </div>
      </div>

      {/* Big counter */}
      <div className="mb-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[24px] font-bold text-slate-900">{formatSomCompact(total)}</span>
          <span className="text-[11px] text-slate-400">из {formatSomCompact(goal.target)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[6px] bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-emerald-600 rounded-full"
          style={{ width: `${progressPct}%`, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </div>

      {/* Sources */}
      <div className="space-y-1.5 mb-3">
        <SourceRow icon={<Coins className="w-3.5 h-3.5 text-amber-500" />}    label="Округление сдачи"   value={sources.rounding ?? 0} />
        <SourceRow icon={<ShieldOff className="w-3.5 h-3.5 text-rose-500" />} label="Заблокированные"    value={sources.blocked  ?? 0} />
        <SourceRow icon={<TrendingDown className="w-3.5 h-3.5 text-blue-500"/>}label="Найденная экономия" value={sources.found    ?? 0} />
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">+{formatSomCompact(recentSum)} за 5 операций</span>
        <span className="text-[11px] font-medium text-emerald-600">{apr}% годовых</span>
      </div>
    </div>
  );
}

function SourceRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">{icon}<span className="text-[12px] text-slate-500">{label}</span></div>
      <span className="text-[12px] font-semibold text-slate-800">{formatSomCompact(value)}</span>
    </div>
  );
}
