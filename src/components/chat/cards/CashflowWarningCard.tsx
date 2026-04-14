"use client";
import { AlertTriangle, Calendar, TrendingDown, Wallet } from "lucide-react";
import { formatSom, formatSomCompact } from "@/lib/format";

type Props = {
  daysUntilSalary: number;
  balance: number;
  upcomingDebits: number;
  projectedShortfall: number;
  riskLevel: "ok" | "tight" | "gap";
};

const RISK = {
  gap:   { bg: "bg-red-50",    border: "border-red-200",    icon: "text-red-500",    label: "Кассовый разрыв", dot: "bg-red-500"    },
  tight: { bg: "bg-amber-50",  border: "border-amber-200",  icon: "text-amber-500",  label: "Туго",            dot: "bg-amber-500"  },
  ok:    { bg: "bg-emerald-50",border: "border-emerald-200",icon: "text-emerald-600",label: "Всё ок",          dot: "bg-emerald-500"},
};

export default function CashflowWarningCard(props: Props) {
  const { daysUntilSalary, balance, upcomingDebits, projectedShortfall, riskLevel } = props;
  const r = RISK[riskLevel];
  const days = daysUntilSalary;
  const suffix = days === 1 ? "день" : days < 5 ? "дня" : "дней";

  return (
    <div className={`rounded-2xl border ${r.border} ${r.bg} p-4 max-w-[280px]`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <AlertTriangle className={`w-5 h-5 ${r.icon}`} strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-900 leading-tight">До зарплаты</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
            <p className="text-[11px] text-slate-500">{r.label}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <Row icon={<Calendar className="w-3.5 h-3.5" />} label="До зарплаты" value={`${days} ${suffix}`} />
        <Row icon={<Wallet className="w-3.5 h-3.5" />} label="Остаток" value={formatSom(balance)} />
        <Row icon={<TrendingDown className="w-3.5 h-3.5" />} label="Предстоящие счета" value={`−${formatSomCompact(upcomingDebits)}`} accent />
        <div className="border-t border-slate-200 pt-2 mt-1">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-slate-500">Остаток после счетов</span>
            <span className={`text-[13px] font-bold ${projectedShortfall < 0 ? "text-red-500" : "text-emerald-600"}`}>
              {projectedShortfall < 0 ? "−" : "+"}{formatSomCompact(Math.abs(projectedShortfall))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-slate-400">{icon}<span className="text-[12px] text-slate-500">{label}</span></div>
      <span className={`text-[13px] font-semibold ${accent ? "text-slate-700" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}
