"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { personas, type PersonaId } from "@/lib/mockData";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChatOverlay({ open, onClose }: Props) {
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="absolute inset-0 z-50 flex flex-col bg-[#F5F7FA]"
          style={{ borderRadius: "24px 24px 0 0" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 bg-white border-b border-[#ECECEC]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.4} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-slate-900 leading-tight">
                  MBank AI
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {personaId
                    ? personas.find((p) => p.id === personaId)?.name
                    : "Выбери персонажа"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 active:bg-slate-100 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {!personaId ? (
              <PersonaPicker onPick={setPersonaId} />
            ) : (
              <EmptyChat personaId={personaId} />
            )}
          </div>

          {/* Composer */}
          {personaId && (
            <div className="px-3 py-3 bg-white border-t border-[#ECECEC] flex items-center gap-2">
              <input
                disabled
                placeholder="Спроси про свои деньги…"
                className="flex-1 h-11 px-4 rounded-full bg-slate-100 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                disabled
                className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white disabled:opacity-60"
                aria-label="Отправить"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PersonaPicker({ onPick }: { onPick: (id: PersonaId) => void }) {
  return (
    <div className="px-4 pt-6 pb-8">
      <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
        Как мне с тобой
        <br />
        общаться?
      </h2>
      <p className="text-[13px] text-slate-500 mt-2">
        Характер можно поменять в любой момент.
      </p>

      <div className="mt-5 space-y-3">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="w-full text-left rounded-2xl p-4 bg-white border border-[#ECECEC] active:scale-[0.99] transition-transform flex items-start gap-3"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-[22px]`}
            >
              <span>{p.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-slate-900">
                {p.name}
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">
                {p.tagline}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyChat({ personaId }: { personaId: PersonaId }) {
  const persona = personas.find((p) => p.id === personaId)!;
  return (
    <div className="px-4 pt-8 pb-6 flex flex-col items-center text-center">
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.accent} flex items-center justify-center text-[30px] mb-3`}
      >
        <span>{persona.emoji}</span>
      </div>
      <p className="text-[16px] font-semibold text-slate-900">
        {persona.name} на связи
      </p>
      <p className="text-[13px] text-slate-500 mt-1 max-w-[260px]">
        Скоро здесь появится чат с tool-calling и генеративным UI.
      </p>
    </div>
  );
}
