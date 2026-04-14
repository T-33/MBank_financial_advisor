"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { personas, type PersonaId } from "@/lib/mockData";
import { useAutopilot } from "@/lib/store";
import MessageList from "./MessageList";

type Props = { open: boolean; onClose: () => void };

const OPENER_TRIGGER = "__opener__";

export default function ChatOverlay({ open, onClose }: Props) {
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const { setPersonaId: persistPersona } = useAutopilot();

  // Reset persona when chat is closed
  useEffect(() => { if (!open) setPersonaId(null); }, [open]);

  const handlePickPersona = (id: PersonaId) => {
    setPersonaId(id);
    persistPersona(id); // propagate to store → intercept banner reads from here
  };

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
          <div className="flex items-center justify-between px-4 pt-4 pb-3 bg-white border-b border-[#ECECEC] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#009C4D] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <path d="M8 1L9.4 5.4L13.9 5.4L10.3 8.1L11.7 12.5L8 9.8L4.3 12.5L5.7 8.1L2.1 5.4L6.6 5.4Z" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#111111] leading-tight">MBank AI</p>
                <p className="text-[11px] text-[#999999] leading-tight">
                  {personaId ? personas.find((p) => p.id === personaId)?.name : "Выбери персонажа"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {personaId && (
                <button onClick={() => setPersonaId(null)} className="text-[11px] text-[#009C4D] font-medium px-2 py-1 active:opacity-70">
                  Сменить
                </button>
              )}
              <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-[#999] active:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!personaId ? (
            <PersonaPicker onPick={handlePickPersona} />
          ) : (
            <ChatBody key={personaId} personaId={personaId} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Persona picker ──────────────────────────────────────────────────────────

function PersonaPicker({ onPick }: { onPick: (id: PersonaId) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-8">
      <h2 className="text-[22px] font-bold text-[#111111] tracking-tight leading-tight">
        Как мне с тобой<br />общаться?
      </h2>
      <p className="text-[13px] text-[#999] mt-2">Характер можно поменять в любой момент.</p>
      <div className="mt-5 space-y-3">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="w-full text-left rounded-2xl p-4 bg-white border border-[#ECECEC] active:scale-[0.99] transition-transform flex items-start gap-3"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-[22px]`}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#111111]">{p.name}</p>
              <p className="text-[12px] text-[#999] mt-0.5 leading-snug">{p.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Chat body ───────────────────────────────────────────────────────────────

const BASE_CHIPS = ["Что в копилке?", "Хватит до зарплаты?", "Куда уходят деньги?", "Покажи подписки", "Покажи машину"];
const TOXIC_EXTRA = "Прожарь мои траты 🔥";

function ChatBody({ personaId }: { personaId: PersonaId }) {
  const [input, setInput] = useState("");
  const openerSent = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { personaId },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Proactive opener — send once on mount
  useEffect(() => {
    if (openerSent.current) return;
    openerSent.current = true;
    sendMessage({ text: OPENER_TRIGGER });
  }, [sendMessage]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Filter out the silent opener trigger from the visible list
  const visibleMessages = messages.filter((m) => {
    if (m.role !== "user") return true;
    const textPart = m.parts.find((p) => p.type === "text");
    const text = textPart && "text" in textPart ? (textPart as { text: string }).text : "";
    return text !== OPENER_TRIGGER;
  });

  // Show chips after opener appears but before the user has typed anything
  const hasUserMessage = visibleMessages.some((m) => m.role === "user");
  const showChips = !hasUserMessage && !isStreaming;
  const chips = personaId === "toxic" ? [...BASE_CHIPS, TOXIC_EXTRA] : BASE_CHIPS;

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {showChips && (
          <div className="pt-5 pb-3">
            <p className="text-[12px] text-[#999] mb-3 text-center">Попробуй спросить</p>
            <div className="flex gap-2 px-4 overflow-x-auto pb-1 scrollbar-hide">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => { setInput(""); sendMessage({ text: c }); }}
                  className="flex-shrink-0 px-3 py-2 rounded-full bg-white border border-[#ECECEC] text-[12px] text-[#111111] font-medium active:scale-95 active:bg-slate-50 transition-transform shadow-sm whitespace-nowrap"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <MessageList messages={visibleMessages} />
        {isStreaming && <TypingIndicator />}
      </div>

      {/* Composer */}
      <div className="px-3 py-3 bg-white border-t border-[#ECECEC] flex items-center gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Спроси про свои деньги…"
          className="flex-1 h-11 px-4 rounded-full bg-slate-100 text-[14px] text-[#111111] placeholder:text-[#AAAAAA] outline-none"
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className="w-11 h-11 rounded-full bg-[#009C4D] flex items-center justify-center text-white disabled:opacity-40 active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

// ── Typing indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="px-4 pb-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#009C4D]"
          style={{ animation: "bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
