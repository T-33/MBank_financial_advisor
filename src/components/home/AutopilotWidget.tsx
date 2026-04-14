"use client";

// AutopilotWidget — reads dynamic total from store, static config from mockData.
// Pulse animation on the progress bar whenever total changes.

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { autopilotSavings } from "@/lib/mockData";
import { formatSomCompact } from "@/lib/format";
import { useAutopilot } from "@/lib/store";

export default function AutopilotWidget() {
  const { autopilotTotal } = useAutopilot();
  const { apr, goal } = autopilotSavings;
  const progressPct = Math.round((autopilotTotal / goal.target) * 100);

  // Pulse state: triggers when total changes
  const [isPulsing, setIsPulsing] = useState(false);
  const prevTotalRef = useRef(autopilotTotal);

  useEffect(() => {
    if (autopilotTotal !== prevTotalRef.current) {
      prevTotalRef.current = autopilotTotal;
      setIsPulsing(true);
      const t = setTimeout(() => setIsPulsing(false), 500);
      return () => clearTimeout(t);
    }
  }, [autopilotTotal]);

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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white" opacity="0.9">
              <path d="M7 0.5L8.2 4.8L12.5 7L8.2 9.2L7 13.5L5.8 9.2L1.5 7L5.8 4.8Z" />
            </svg>
            <p className="text-[14px] font-semibold leading-tight">
              AI копит тебе {goal.icon} {goal.name}
            </p>
          </div>
          <p className="text-[11px] leading-tight" style={{ opacity: 0.78 }}>
            {goal.aiReason}
          </p>
        </div>

        {/* Counter animates on change via key remount */}
        <div className="text-right flex-shrink-0">
          <motion.p
            key={autopilotTotal}
            initial={{ opacity: 0.6, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-[26px] font-bold leading-tight tracking-tight"
          >
            {formatSomCompact(autopilotTotal)}
          </motion.p>
          <p className="text-[10px]" style={{ opacity: 0.7 }}>
            из {formatSomCompact(goal.target)}
          </p>
        </div>
      </div>

      {/* Progress bar — pulses on change */}
      <div className="mt-3 mb-1.5">
        <motion.div
          animate={isPulsing ? { scale: [1, 1.025, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "left center" }}
        >
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
        </motion.div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px]" style={{ opacity: 0.68 }}>
          AI управляет сам • {apr}% годовых MBank
        </p>
        <button className="text-[11px] underline underline-offset-2" style={{ opacity: 0.68 }}>
          Поменять цель ›
        </button>
      </div>
    </div>
  );
}
