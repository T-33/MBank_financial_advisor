"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, ArrowRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { personas, type PersonaId } from "@/lib/mockData";
import { useAutopilot } from "@/lib/store";
import MessageList from "./MessageList";

type Props = { open: boolean; onClose: () => void };

const OPENER_TRIGGER = "__opener__";

// Smooth spring for the main sheet slide
const SHEET_SPRING = { type: "spring" as const, damping: 32, stiffness: 320, mass: 0.9 };

export default function ChatOverlay({ open, onClose }: Props) {
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const { setPersonaId: persistPersona } = useAutopilot();

  // Reset persona when chat is closed
  useEffect(() => { if (!open) setPersonaId(null); }, [open]);

  const handlePickPersona = (id: PersonaId) => {
    setPersonaId(id);
    persistPersona(id);
  };

  const activePersonaObj = personas.find((p) => p.id === personaId);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { type: "spring", damping: 28, stiffness: 280 } }}
          transition={SHEET_SPRING}
          className="absolute inset-0 z-50 flex flex-col"
          style={{
            background: "#F5F7FA",
            borderRadius: "28px 28px 44px 44px",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-9 h-1 rounded-full bg-[#D8D8D8]" />
          </div>

          {/* Header */}
          <div
            className="flex items-center justify-between px-4 pt-2 pb-3 flex-shrink-0"
            style={{
              background: "white",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: activePersonaObj
                    ? undefined
                    : "linear-gradient(135deg, #00B85A 0%, #008D3F 100%)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {activePersonaObj ? (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${activePersonaObj.accent} text-[16px]`}>
                    {activePersonaObj.emoji}
                  </div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                    <path d="M8 1L9.4 5.4L13.9 5.4L10.3 8.1L11.7 12.5L8 9.8L4.3 12.5L5.7 8.1L2.1 5.4L6.6 5.4Z" />
                  </svg>
                )}
              </motion.div>
              <div>
                <p className="text-[15px] font-semibold text-[#111111] leading-tight">MBank AI</p>
                <motion.p
                  key={personaId}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-[#999999] leading-tight"
                >
                  {activePersonaObj ? activePersonaObj.name : "Выбери персонажа"}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {personaId && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setPersonaId(null)}
                  className="text-[11px] text-[#009C4D] font-semibold px-2.5 py-1.5 rounded-lg active:bg-[#009C4D]/10 transition-colors"
                >
                  Сменить
                </motion.button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#999] active:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <AnimatePresence mode="wait">
            {!personaId ? (
              <motion.div
                key="picker"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ type: "spring", damping: 26, stiffness: 300 }}
                className="flex-1 overflow-hidden"
              >
                <PersonaPicker onPick={handlePickPersona} />
              </motion.div>
            ) : (
              <motion.div
                key={personaId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 26, stiffness: 300, delay: 0.05 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <ChatBody personaId={personaId} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Persona picker ──────────────────────────────────────────────────────────

function PersonaPicker({ onPick }: { onPick: (id: PersonaId) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: "spring", damping: 24, stiffness: 280 }}
        className="text-[22px] font-bold text-[#111111] tracking-tight leading-tight"
      >
        Как мне с тобой<br />общаться?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[13px] text-[#999] mt-2"
      >
        Характер можно поменять в любой момент.
      </motion.p>
      <div className="mt-5 space-y-3">
        {personas.map((p, index) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12 + index * 0.09, type: "spring", damping: 24, stiffness: 300 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(p.id)}
            className="w-full text-left rounded-2xl p-4 bg-white flex items-start gap-3"
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-[22px] flex-shrink-0`}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#111111]">{p.name}</p>
              <p className="text-[12px] text-[#999] mt-0.5 leading-snug">{p.tagline}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#CCCCCC] self-center flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Chat body ───────────────────────────────────────────────────────────────

const BASE_CHIPS = ["Что в копилке?", "Хватит до зарплаты?", "Куда уходят деньги?", "Покажи подписки", "Покажи машину"];
const TOXIC_EXTRA = "Прожарь мои траты 🔥";
const MOTIVATOR_EXTRA = "Заряди меня ⚡";

function ChatBody({ personaId }: { personaId: PersonaId }) {
  const [input, setInput] = useState("");
  const openerSent = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { personaId } }),
    [personaId],
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isStreaming = status === "streaming" || status === "submitted";

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

  const visibleMessages = messages.filter((m) => {
    if (m.role !== "user") return true;
    const textPart = m.parts.find((p) => p.type === "text");
    const text = textPart && "text" in textPart ? (textPart as { text: string }).text : "";
    return text !== OPENER_TRIGGER;
  });

  const hasUserMessage = visibleMessages.some((m) => m.role === "user");
  const showChips = !hasUserMessage && !isStreaming;
  const chips =
    personaId === "toxic"
      ? [...BASE_CHIPS, TOXIC_EXTRA]
      : personaId === "motivator"
        ? [...BASE_CHIPS, MOTIVATOR_EXTRA]
        : BASE_CHIPS;

  return (
    <>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {showChips && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="pt-5 pb-3"
            >
              <p className="text-[12px] text-[#AAAAAA] mb-3 text-center font-medium">Попробуй спросить</p>
              <div className="flex gap-2 px-4 overflow-x-auto pb-1 scrollbar-hide">
                {chips.map((c, i) => (
                  <motion.button
                    key={c}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, type: "spring", damping: 22, stiffness: 300 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => { setInput(""); sendMessage({ text: c }); }}
                    className="flex-shrink-0 px-3.5 py-2 rounded-full bg-white text-[12px] text-[#111111] font-medium whitespace-nowrap"
                    style={{
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                  >
                    {c}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <MessageList messages={visibleMessages} />
        {isStreaming && <TypingIndicator />}
      </div>

      {/* Composer */}
      <div
        className="px-3 py-3 flex items-center gap-2 flex-shrink-0"
        style={{
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Спроси про свои деньги…"
          className="flex-1 h-11 px-4 rounded-full text-[14px] text-[#111111] placeholder:text-[#BBBBBB] outline-none transition-all"
          style={{
            background: "#F2F2F2",
            border: "1.5px solid transparent",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1.5px solid rgba(0,156,77,0.35)";
            e.currentTarget.style.background = "#FAFAFA";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1.5px solid transparent";
            e.currentTarget.style.background = "#F2F2F2";
          }}
          autoFocus
        />
        <motion.button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{
            background: input.trim() && !isStreaming
              ? "linear-gradient(135deg, #00B85A 0%, #008D3F 100%)"
              : "#D8D8D8",
            boxShadow: input.trim() && !isStreaming
              ? "0 4px 14px rgba(0,156,77,0.35)"
              : "none",
            transition: "background 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </>
  );
}

// ── Typing indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className="px-4 pt-3 pb-2 flex items-center gap-1"
    >
      <div
        className="bg-white rounded-[16px] rounded-bl-[6px] px-4 py-3 flex items-center gap-1.5"
        style={{
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: "#009C4D" }}
            animate={{
              y: [0, -5, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
