"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Coins, ShieldOff, TrendingDown, Snowflake, ChevronLeft, TrendingUp, Sparkles, CircleDollarSign, Ban } from "lucide-react";
import { autopilotSavings, SOURCE_META, type AutopilotHistoryReason } from "@/lib/mockData";
import { formatSomCompact, formatDate } from "@/lib/format";
import { useAutopilot } from "@/lib/store";

type Props = { open: boolean; onClose: () => void };

// ── Constants ────────────────────────────────────────────────────────────────

const RING_RADIUS = 62;
const RING_STROKE = 12;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const REASON_ICONS: Record<AutopilotHistoryReason, React.ElementType> = {
  rounding: Coins,
  blocked: ShieldOff,
  found: TrendingDown,
  frozen: Snowflake,
};

const HOW_IT_WORKS = [
  {
    icon: Coins,
    color: "#FABF00",
    title: "Округление сдачи",
    desc: "Каждая покупка округляется до 10 С, разница — в копилку",
  },
  {
    icon: Ban,
    color: "#E53E3E",
    title: "Отмена импульсов",
    desc: "AI замечает паттерн — предлагает отменить и сохранить",
  },
  {
    icon: TrendingDown,
    color: "#3B82F6",
    title: "Поиск экономии",
    desc: "AI сравнивает месяцы и автоматически откладывает разницу",
  },
];

// ── Overlay ──────────────────────────────────────────────────────────────────

export default function DepositDetailOverlay({ open, onClose }: Props) {
  const { autopilotTotal, dynamicHistory } = useAutopilot();
  const { apr, goal, interestEarned, depositStartISO } = autopilotSavings;

  const progressPct = Math.min(Math.round((autopilotTotal / goal.target) * 100), 100);
  const fillOffset = RING_CIRCUMFERENCE * (1 - progressPct / 100);

  // Months since deposit start
  const startDate = new Date(depositStartISO);
  const now = new Date("2026-04-14");
  const monthsActive = Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const monthlyInterest = monthsActive > 0 ? Math.round(interestEarned / monthsActive) : 0;

  // Merge static + dynamic history, sorted newest first
  const staticEntries = autopilotSavings.history.map((h, i) => ({
    ...h,
    id: `static-${i}`,
    timestamp: new Date(h.dateISO).getTime(),
    isDynamic: false,
  }));
  const dynEntries = dynamicHistory.map((h) => ({ ...h, isDynamic: true }));
  const allEntries = [...dynEntries, ...staticEntries].sort((a, b) => b.timestamp - a.timestamp);

  // Compute source totals from all entries
  const sourceTotals: Record<AutopilotHistoryReason, number> = { rounding: 0, blocked: 0, found: 0, frozen: 0 };
  for (const e of allEntries) {
    sourceTotals[e.reason] = (sourceTotals[e.reason] ?? 0) + e.amount;
  }
  const sourceTotal = Object.values(sourceTotals).reduce((a, b) => a + b, 0);

  const cx = RING_RADIUS + RING_STROKE;
  const cy = RING_RADIUS + RING_STROKE;
  const ringSize = (RING_RADIUS + RING_STROKE) * 2;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="deposit-overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { type: "spring", damping: 30, stiffness: 300 } }}
          transition={{ type: "spring", damping: 30, stiffness: 320, mass: 0.9 }}
          className="absolute inset-0 z-[50] flex flex-col bg-[#F2F2F2]"
          style={{ borderRadius: "44px" }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-white flex-shrink-0" style={{ borderRadius: "44px 44px 0 0" }}>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#009C4D] active:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.2} />
            </button>
            <div className="text-center flex-1">
              <p className="text-[15px] font-semibold text-[#111111] leading-tight">AI-Копилка</p>
              <p className="text-[11px] text-[#999] leading-tight">MSmart Deposit · {apr}% годовых</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#999] active:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">

            {/* ── Hero card ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, type: "spring", damping: 26, stiffness: 300 }}
              className="px-4 pt-4 mb-3"
            >
              <div
                className="rounded-[20px] p-5 text-white"
                style={{
                  background: "linear-gradient(135deg, #00A854 0%, #007535 100%)",
                  boxShadow: "0 6px 24px rgba(0,168,84,0.38)",
                }}
              >
                <div className="flex justify-center mb-3">
                  <svg width={ringSize} height={ringSize} style={{ display: "block" }}>
                    <circle
                      cx={cx} cy={cy} r={RING_RADIUS}
                      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={RING_STROKE}
                    />
                    <motion.circle
                      cx={cx} cy={cy} r={RING_RADIUS}
                      fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth={RING_STROKE}
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                      animate={{ strokeDashoffset: fillOffset }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
                    />
                    <text
                      x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize="22" fontWeight="700" fontFamily="inherit"
                    >
                      {formatSomCompact(autopilotTotal)}
                    </text>
                    <text
                      x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle"
                      fill="rgba(255,255,255,0.62)" fontSize="10" fontFamily="inherit"
                    >
                      из {formatSomCompact(goal.target)}
                    </text>
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-[18px] font-bold leading-tight">
                    {goal.icon} {goal.name}
                  </p>
                  <p className="text-[12px] mt-1" style={{ opacity: 0.68 }}>
                    {progressPct}% цели · открыт с {formatDate(depositStartISO)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Interest banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, type: "spring", damping: 26, stiffness: 300 }}
              className="px-4 mb-3"
            >
              <div
                className="rounded-[16px] p-4 flex items-center gap-3"
                style={{
                  background: "rgba(0,156,77,0.06)",
                  border: "1px solid rgba(0,156,77,0.15)",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#009C4D]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#009C4D]" strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#111111]">Начислено процентов</p>
                  <p className="text-[12px] text-[#555] mt-0.5">
                    ~{formatSomCompact(interestEarned)} за {monthsActive} мес. · ~{formatSomCompact(monthlyInterest)}/мес
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Source breakdown ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20, type: "spring", damping: 26, stiffness: 300 }}
              className="px-4 mb-3"
            >
              <div className="mbank-card">
                <p className="text-[15px] font-semibold text-[#111111] mb-3">Откуда деньги</p>

                {/* Segmented bar */}
                {sourceTotal > 0 && (
                  <div className="h-[8px] rounded-full overflow-hidden flex gap-[2px] mb-3">
                    {(Object.entries(sourceTotals) as [AutopilotHistoryReason, number][])
                      .filter(([, v]) => v > 0)
                      .map(([reason, value], i, arr) => (
                        <div
                          key={reason}
                          style={{
                            width: `${(value / sourceTotal) * 100}%`,
                            background: SOURCE_META[reason].color,
                            borderRadius: i === 0 ? "4px 0 0 4px" : i === arr.length - 1 ? "0 4px 4px 0" : "0",
                          }}
                        />
                      ))}
                  </div>
                )}

                {/* Source rows */}
                <div className="space-y-2.5">
                  {(Object.entries(SOURCE_META) as [AutopilotHistoryReason, typeof SOURCE_META[AutopilotHistoryReason]][]).map(([reason, meta]) => {
                    const Icon = REASON_ICONS[reason];
                    const value = sourceTotals[reason] ?? 0;
                    return (
                      <div key={reason} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${meta.color}15` }}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} strokeWidth={2} />
                          </div>
                          <span className="text-[13px] text-[#555]">{meta.label}</span>
                        </div>
                        <span className={`text-[13px] font-semibold ${value > 0 ? "text-[#111111]" : "text-[#CCC]"}`}>
                          {value > 0 ? formatSomCompact(value) : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── How it works ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, type: "spring", damping: 26, stiffness: 300 }}
              className="px-4 mb-3"
            >
              <div className="mbank-card">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#009C4D]" strokeWidth={2.2} />
                  <p className="text-[15px] font-semibold text-[#111111]">Как работает</p>
                </div>
                <div className="space-y-3">
                  {HOW_IT_WORKS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${item.color}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#111111] leading-tight">{item.title}</p>
                          <p className="text-[11px] text-[#999] mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── History ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, type: "spring", damping: 26, stiffness: 300 }}
              className="px-4 mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[15px] font-semibold text-[#111111]">История операций</p>
                <span className="text-[12px] text-[#999] font-medium px-2 py-0.5 rounded-full bg-[#E8E8E8]">
                  {allEntries.length}
                </span>
              </div>
              <div className="mbank-card !p-0 overflow-hidden">
                {allEntries.map((entry, i) => {
                  const meta = SOURCE_META[entry.reason];
                  return (
                    <motion.div
                      key={entry.id}
                      initial={entry.isDynamic
                        ? { backgroundColor: "rgba(0,156,77,0.14)", opacity: 0, x: -8 }
                        : { opacity: 0, y: 4 }}
                      animate={{ backgroundColor: "rgba(0,156,77,0)", opacity: 1, x: 0, y: 0 }}
                      transition={{
                        duration: entry.isDynamic ? 1.6 : 0.3,
                        delay: entry.isDynamic ? 0 : 0.35 + i * 0.04,
                        ease: "easeOut",
                      }}
                      className={`flex items-center gap-3 px-4 py-3 ${i < allEntries.length - 1 ? "mbank-divider" : ""}`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${meta.color}15` }}
                      >
                        {(() => {
                          const Icon = REASON_ICONS[entry.reason];
                          return <Icon className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2} />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#111111] truncate">{entry.note}</p>
                        <p className="text-[11px] text-[#999]">{formatDate(entry.dateISO)}</p>
                      </div>
                      <p className="text-[13px] font-bold text-[#009C4D] flex-shrink-0">
                        +{formatSomCompact(entry.amount)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Deposit info footer ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="px-4 mb-4"
            >
              <div
                className="rounded-[16px] p-4 flex items-center gap-3"
                style={{ background: "rgba(0,0,0,0.03)" }}
              >
                <CircleDollarSign className="w-5 h-5 text-[#999] flex-shrink-0" strokeWidth={1.8} />
                <p className="text-[11px] text-[#999] leading-snug">
                  Копилка — это депозит MSmart с {apr}% годовых. Начисления ежемесячно. AI управляет пополнениями автоматически.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
