"use client";

// InterceptBanner — slides down from the top of the phone shell.
// Offline-safe: all copy comes from mockData.pendingTransactions[].intercept.
// z-[60] — higher than ChatOverlay (z-50) and DevTriggerButton.
// Trigger only when chatOpen === false (enforced by parent page.tsx).

import { useState } from "react";
import { motion } from "framer-motion";
import { personas } from "@/lib/mockData";
import { formatSomCompact } from "@/lib/format";
import type { PendingTransaction, PersonaId } from "@/lib/mockData";

type Props = {
  pending: PendingTransaction;
  personaId: PersonaId;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function InterceptBanner({ pending, personaId, onCancel, onConfirm }: Props) {
  const persona = personas.find((p) => p.id === personaId) ?? personas[0];

  // Pick a random reply once on mount — useState initializer runs only once
  const [reply] = useState<string>(() => {
    const arr = pending.intercept[personaId];
    return arr[Math.floor(Math.random() * arr.length)];
  });

  return (
    <>
      {/* Dim backdrop */}
      <div className="absolute inset-0 z-[58] bg-black/25" />

      {/* Banner slides down from top */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-110%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="absolute top-0 left-0 right-0 z-[60] bg-white"
        style={{
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 8px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top safe-area spacer — matches status bar height */}
        <div className="h-[40px]" />

        <div className="px-4 pb-5">
          {/* ── Header row ── */}
          <div className="flex items-center gap-2.5 mb-3">
            {/* AI avatar in persona gradient */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[18px] flex-shrink-0 bg-gradient-to-br ${persona.accent}`}
            >
              {persona.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#009C4D] font-semibold uppercase tracking-wide leading-none mb-0.5">
                MBank AI · {persona.name}
              </p>
              <p className="text-[14px] font-semibold text-[#111111] leading-tight truncate">
                {pending.pattern}
              </p>
            </div>
          </div>

          {/* ── AI reply ── */}
          <p className="text-[13px] text-[#333333] leading-relaxed mb-3">
            {reply}
          </p>

          {/* ── Amount chip ── */}
          <div
            className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 mb-4"
            style={{ background: "#F5F5F5" }}
          >
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[13px] font-bold flex-shrink-0"
              style={{ background: "#EBEBEB", color: "#555" }}
            >
              {pending.merchant.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111111] truncate">{pending.merchant}</p>
            </div>
            <p className="text-[18px] font-bold text-[#111111] flex-shrink-0">
              {formatSomCompact(pending.amount)}
            </p>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex gap-2 mb-3">
            {/* Ghost — allow transaction */}
            <button
              onClick={onConfirm}
              className="flex-1 h-11 rounded-xl text-[13px] font-semibold text-[#555555] active:opacity-70 transition-opacity"
              style={{
                background: "transparent",
                border: "1px solid #E0E0E0",
              }}
            >
              Всё равно купить
            </button>

            {/* Primary — cancel → save */}
            <button
              onClick={onCancel}
              className="flex-1 h-11 rounded-xl text-[13px] font-semibold text-white active:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #00B85A 0%, #008D3F 100%)",
                boxShadow: "0 4px 16px rgba(0,156,77,0.30)",
              }}
            >
              Отмена — в копилку
            </button>
          </div>

          {/* ── Deposit footnote ── */}
          <p className="text-[11px] text-[#999999] text-center leading-snug">
            Эти {formatSomCompact(pending.amount)} уедут на твой депозит 8% годовых
          </p>
        </div>
      </motion.div>
    </>
  );
}
