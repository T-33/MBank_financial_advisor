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

const PERSONA_LABEL_COLOR: Record<PersonaId, string> = {
  caring: "text-[#009C4D]",
  toxic: "text-[#F43F5E]",
  motivator: "text-[#F97316]",
};

export default function InterceptBanner({ pending, personaId, onCancel, onConfirm }: Props) {
  const persona = personas.find((p) => p.id === personaId) ?? personas[0];
  const labelColor = PERSONA_LABEL_COLOR[personaId] ?? PERSONA_LABEL_COLOR.caring;

  const [reply] = useState<string>(() => {
    const arr = pending.intercept[personaId];
    return arr[Math.floor(Math.random() * arr.length)];
  });

  return (
    <>
      {/* Blurred backdrop */}
      <motion.div
        className="absolute inset-0 z-[58]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{ background: "rgba(0,0,0,0.30)", backdropFilter: "blur(4px)" }}
      />

      {/* Banner slides down from top */}
      <motion.div
        initial={{ y: "-105%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-108%", transition: { type: "spring", damping: 30, stiffness: 320 } }}
        transition={{ type: "spring", damping: 26, stiffness: 300, mass: 0.85 }}
        className="absolute top-0 left-0 right-0 z-[60] bg-white"
        style={{
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Status bar spacer */}
        <div className="h-[40px]" />

        <div className="px-4 pb-5">
          {/* ── Header row ── */}
          <div className="flex items-center gap-2.5 mb-3">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.18, type: "spring", damping: 18, stiffness: 300 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] flex-shrink-0 bg-gradient-to-br ${persona.accent}`}
            >
              {persona.emoji}
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-semibold uppercase tracking-wide leading-none mb-0.5 ${labelColor}`}>
                MBank AI · {persona.name}
              </p>
              <motion.p
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="text-[14px] font-semibold text-[#111111] leading-tight"
              >
                {pending.pattern}
              </motion.p>
            </div>
          </div>

          {/* ── AI reply ── */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, type: "spring", damping: 24, stiffness: 280 }}
            className="text-[13px] text-[#333333] leading-relaxed mb-3"
          >
            {reply}
          </motion.p>

          {/* ── Amount chip ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.34, type: "spring", damping: 22, stiffness: 280 }}
            className="flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 mb-4"
            style={{
              background: "#F5F5F5",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[14px] font-bold flex-shrink-0"
              style={{ background: "#E8E8E8", color: "#666" }}
            >
              {pending.merchant.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111111] truncate">{pending.merchant}</p>
              <p className="text-[11px] text-[#999]">Ожидает подтверждения</p>
            </div>
            <p className="text-[18px] font-bold text-[#111111] flex-shrink-0">
              {formatSomCompact(pending.amount)}
            </p>
          </motion.div>

          {/* ── Action buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, type: "spring", damping: 22, stiffness: 280 }}
            className="flex gap-2 mb-3"
          >
            {/* Ghost — allow transaction */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className="flex-1 h-12 rounded-[14px] text-[13px] font-semibold text-[#555555]"
              style={{
                background: "transparent",
                border: "1.5px solid #E0E0E0",
              }}
            >
              Всё равно купить
            </motion.button>

            {/* Primary — cancel → save */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onCancel}
              className="flex-1 h-12 rounded-[14px] text-[13px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #00B85A 0%, #008D3F 100%)",
                boxShadow: "0 4px 18px rgba(0,156,77,0.35)",
              }}
            >
              Отмена — в копилку
            </motion.button>
          </motion.div>

          {/* ── Deposit footnote ── */}
          <p className="text-[11px] text-[#AAAAAA] text-center leading-snug">
            Эти {formatSomCompact(pending.amount)} уедут на депозит · 8% годовых
          </p>
        </div>
      </motion.div>
    </>
  );
}
