"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { autopilotSavings } from "@/lib/mockData";
import { formatSomCompact } from "@/lib/format";
import { useAutopilot } from "@/lib/store";

const RADIUS = 52;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 326.7

type Props = { onTap?: () => void };

export default function AutopilotWidget({ onTap }: Props) {
  const { autopilotTotal } = useAutopilot();
  const { apr, goal } = autopilotSavings;
  const progressPct = Math.min(Math.round((autopilotTotal / goal.target) * 100), 100);
  const fillOffset = CIRCUMFERENCE * (1 - progressPct / 100);

  // Pulse when total changes
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

  const cx = RADIUS + STROKE;
  const cy = RADIUS + STROKE;
  const size = (RADIUS + STROKE) * 2;

  return (
    <motion.div
      onClick={onTap}
      whileTap={{ scale: 0.97 }}
      whileHover={{ boxShadow: "0 10px 32px rgba(0,168,84,0.48)", y: -1 }}
      className="rounded-[20px] p-4 text-white cursor-pointer"
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      style={{
        background: "linear-gradient(135deg, #00A854 0%, #007535 100%)",
        boxShadow: "0 6px 24px rgba(0,168,84,0.38)",
      }}
    >
      {/* Top row: goal name + % badge */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[16px] font-bold leading-tight">
          {goal.icon} {goal.name}
        </p>
        <motion.span
          key={progressPct}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          {progressPct}%
        </motion.span>
      </div>

      {/* Ring + amount centered */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={isPulsing ? { scale: [1, 1.06, 0.98, 1] } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width={size} height={size} style={{ display: "block" }}>
            {/* Track */}
            <circle
              cx={cx} cy={cy} r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={STROKE}
            />
            {/* Fill — animates from empty to progressPct on mount */}
            <motion.circle
              cx={cx} cy={cy} r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: fillOffset }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
            {/* Center text */}
            <text
              x={cx} y={cy - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="20"
              fontWeight="700"
              fontFamily="inherit"
            >
              {formatSomCompact(autopilotTotal)}
            </text>
            <text
              x={cx} y={cy + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.62)"
              fontSize="10"
              fontFamily="inherit"
            >
              из {formatSomCompact(goal.target)}
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-[11px]" style={{ opacity: 0.68 }}>
          AI управляет сам • {apr}% год.
        </p>
        <span className="text-[11px] underline underline-offset-2" style={{ opacity: 0.68 }}>
          Подробнее ›
        </span>
      </div>
    </motion.div>
  );
}
