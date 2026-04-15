"use client";
import { useEffect } from "react";
import { Repeat, Music, Tv, Video, Cloud, Smartphone, Snowflake } from "lucide-react";
import { formatSomCompact } from "@/lib/format";
import { useAutopilot } from "@/lib/store";

type Sub = { id: string; name: string; amount: number; nextCharge: string; category: string; frozen?: boolean };
type Props = { subscriptions: Sub[]; totalMonthly: number; count: number };

const SUB_ICONS: Record<string, React.ElementType> = {
  "Spotify Premium": Music,
  "Netflix": Tv,
  "YouTube Premium": Video,
  "iCloud+ 200GB": Cloud,
};

export default function SubscriptionFreezeCard({ subscriptions, totalMonthly }: Props) {
  // Frozen state lives in AutopilotProvider — persists across all card instances.
  const { frozenSubIds, toggleFrozenSub, addFrozenSub } = useAutopilot();

  // Server → client sync: if the AI froze a subscription via tool call,
  // the tool output has frozen:true — mirror it into the client context on mount.
  useEffect(() => {
    subscriptions.forEach((sub) => {
      if (sub.frozen) addFrozenSub(sub.id);
    });
    // addFrozenSub is stable (defined inside provider), subscriptions are immutable props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Button handler: update client context + immediately sync to server so the
  // next AI tool call sees the correct state.
  function handleToggle(id: string) {
    const willBeFrozen = !frozenSubIds.has(id);
    toggleFrozenSub(id);
    fetch("/api/sync-frozen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, frozen: willBeFrozen }),
    }).catch(() => {/* fire-and-forget, UI already updated */});
  }

  // Count frozen from context (authoritative source)
  const frozenCount = subscriptions.filter((s) => frozenSubIds.has(s.id)).length;
  const savedMonthly = subscriptions
    .filter((s) => frozenSubIds.has(s.id))
    .reduce((sum, s) => sum + s.amount, 0);

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
          const isFrozen = frozenSubIds.has(sub.id);
          return (
            <div key={sub.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isFrozen ? "bg-blue-50" : "bg-slate-100"}`}>
                {isFrozen
                  ? <Snowflake className="w-4 h-4 text-blue-400" strokeWidth={1.8} />
                  : <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-medium truncate transition-colors ${isFrozen ? "text-slate-400 line-through" : "text-slate-900"}`}>
                  {sub.name}
                </p>
                <p className="text-[10px] text-slate-400">{formatSomCompact(sub.amount)}/мес</p>
              </div>
              <button
                onClick={() => handleToggle(sub.id)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-colors ${
                  isFrozen
                    ? "bg-blue-50 text-blue-400 hover:bg-blue-100"
                    : "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20"
                }`}
              >
                {isFrozen ? "Разморозить" : "Заморозить"}
              </button>
            </div>
          );
        })}
      </div>

      {frozenCount > 0 && (
        <p className="text-[11px] text-emerald-600 font-medium mt-3 pt-2 border-t border-slate-100">
          ✓ {frozenCount} подписок заморожено · экономия {formatSomCompact(savedMonthly)}/мес
        </p>
      )}
    </div>
  );
}
