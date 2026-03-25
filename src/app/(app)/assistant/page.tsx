"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Can I afford a 5,000 KGS purchase?",
  "Where did my money go this month?",
  "How much should I save each month?",
  "What is mInvest?",
  "Am I spending too much on food?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your MBank financial advisor, powered by Claude AI. I have access to your account, spending patterns, and upcoming bills. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: text }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection failed. Add your ANTHROPIC_API_KEY to `.env.local` and restart." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto px-6 pb-6 pt-8">
      {/* Header */}
      <div className="mb-6 flex-shrink-0 animate-fade-up opacity-0-init">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Claude AI</p>
        <h1 className="text-white font-semibold text-2xl tracking-tight">Financial Advisor</h1>
        <p className="text-white/30 text-sm mt-1">Knows your account · bills · spending · goals</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mb-0.5"
                style={{
                  background: "linear-gradient(135deg, rgba(245,176,64,0.2) 0%, rgba(245,176,64,0.06) 100%)",
                  border: "1px solid rgba(245,176,64,0.2)",
                  color: "#F5B040",
                }}
              >
                ✦
              </div>
            )}
            <div
              className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === "user"
                  ? {
                      background: "linear-gradient(135deg, rgba(245,176,64,0.18) 0%, rgba(245,176,64,0.08) 100%)",
                      border: "1px solid rgba(245,176,64,0.2)",
                      color: "#FDE68A",
                      borderBottomRightRadius: "4px",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.75)",
                      borderBottomLeftRadius: "4px",
                    }
              }
            >
              {msg.content}
              {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <span className="inline-flex gap-1 items-center h-4">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1 h-1 rounded-full inline-block animate-bounce"
                      style={{ background: "rgba(255,255,255,0.3)", animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3 flex-shrink-0">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,176,64,0.3)";
                (e.currentTarget as HTMLElement).style.color = "#F5B040";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex gap-2 flex-shrink-0 p-1.5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <input
          className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 px-3 py-2 focus:outline-none"
          placeholder="Ask about your finances…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #F5B040 0%, #E09420 100%)",
            color: "#0A1628",
            boxShadow: input.trim() ? "0 0 16px rgba(245,176,64,0.3)" : "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
