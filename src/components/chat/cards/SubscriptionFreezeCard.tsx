"use client";
import { Repeat, Music, Tv, Video, Cloud, Smartphone } from "lucide-react";
import { formatSomCompact } from "@/lib/format";
import { useState } from "react";

type Sub = { id: string; name: string; amount: number; nextCharge: string; category: string };
type Props = { subscriptions: Sub[]; totalMonthly: number; count: number };

const SUB_ICONS: Record<string, React.ElementType> = {
  "Spotify Premium": Music,
  "Netflix": Tv,
  "YouTube Premium": Video,
  "iCloud+ 200GB": Cloud,
};

export default function SubscriptionFreezeCard({ subscriptions, totalMonthly }: Props) {
  const [frozen, setFrozen] = useState<Set<string>>(new Set());

  return (
    <div className="bg-white rounded-2xl border border-[#ECECEC] p-4 max-w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
          <Repeat className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-slate-900 leading-tight">Подписки</p>
          <p className="text-[11px] text-slate-500">Итого: {formatSomCompact(totalMonthly)}/мес</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {subscriptions.map((sub) => {
          const Icon = SUB_ICONS[sub.name] ?? Smartphone;
          const isFrozen = frozen.has(sub.id);
          return (
            <div key={sub.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-900 truncate">{sub.name}</p>
                <p className="text-[10px] text-slate-400">{formatSomCompact(sub.amount)}/мес</p>
              </div>
              <button
                onClick={() => setFrozen((prev) => { const s = new Set(prev); s.has(sub.id) ? s.delete(sub.id) : s.add(sub.id); return s; })}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-colors ${
                  isFrozen
                    ? "bg-slate-100 text-slate-500"
                    : "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20"
                }`}
              >
                {isFrozen ? "Разморозить" : "Заморозить"}
              </button>
            </div>
          );
        })}
      </div>

      {frozen.size > 0 && (
        <p className="text-[11px] text-emerald-600 font-medium mt-3 pt-2 border-t border-slate-100">
          ✓ {frozen.size} подписок заморожено
        </p>
      )}
    </div>
  );
}
