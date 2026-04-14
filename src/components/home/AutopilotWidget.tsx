"use client";

// AutopilotWidget — AI Autopilot Savings jar visible on Home.
// Pure stateless — reads from mockData, no LLM calls.

import { autopilotSavings } from "@/lib/mockData";
import { formatSomCompact } from "@/lib/format";

export default function AutopilotWidget() {
  const { total, apr, goal } = autopilotSavings;
  const progress = total / goal.target; // 84500 / 500000 = 0.169
  const progressPct = Math.round(progress * 100);

  return (
    <div
      className="rounded-[20px] p-4 text-white"
      style={{
        background: "linear-gradient(135deg, #00A854 0%, #007535 100%)",
        boxShadow: "0 6px 24px rgba(0,168,84,0.38)",
      }}
    >
      {/* Top row: title + counter */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {/* Sparkle icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white" opacity="0.9">
              <path d="M7 0.5L8.2 4.8L12.5 7L8.2 9.2L7 13.5L5.8 9.2L1.5 7L5.8 4.8Z"/>
            </svg>
            <p className="text-[14px] font-semibold leading-tight">
              AI копит тебе {goal.icon} {goal.name}
            </p>
          </div>
          <p className="text-[11px] leading-tight" style={{ opacity: 0.78 }}>
            {goal.aiReason}
          </p>
        </div>
        {/* Big counter */}
        <div className="text-right flex-shrink-0">
          <p className="text-[26px] font-bold leading-tight tracking-tight">
            {formatSomCompact(total)}
          </p>
          <p className="text-[10px]" style={{ opacity: 0.7 }}>
            из {formatSomCompact(goal.target)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 mb-1.5">
        <div
          className="h-[6px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background: "rgba(255,255,255,0.9)",
              transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
      </div>

      {/* Footer row: info + ghost link */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px]" style={{ opacity: 0.68 }}>
          AI управляет сам • {apr}% годовых MBank
        </p>
        <button
          className="text-[11px] underline underline-offset-2"
          style={{ opacity: 0.68 }}
        >
          Поменять цель ›
        </button>
      </div>
    </div>
  );
}
