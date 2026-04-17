"use client";

import { UIMessage } from "ai";
import { useEffect } from "react";
import { motion } from "framer-motion";
import CashflowWarningCard from "./cards/CashflowWarningCard";
import SpendingBreakdownCard from "./cards/SpendingBreakdownCard";
import SubscriptionFreezeCard from "./cards/SubscriptionFreezeCard";
import AutopilotJarCard from "./cards/AutopilotJarCard";
import MMarketCrossSellCard from "./cards/MMarketCrossSellCard";
import { useAutopilot } from "@/lib/store";
import type { PersonaId } from "@/lib/mockData";

type Props = { message: UIMessage };

const USER_BUBBLE_BG: Record<PersonaId, { gradient: string; shadow: string }> = {
  caring: {
    gradient: "linear-gradient(135deg, #00B85A 0%, #008D3F 100%)",
    shadow: "0 2px 12px rgba(0,156,77,0.28)",
  },
  toxic: {
    gradient: "linear-gradient(135deg, #F43F5E 0%, #A21CAF 100%)",
    shadow: "0 2px 12px rgba(244,63,94,0.28)",
  },
  motivator: {
    gradient: "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)",
    shadow: "0 2px 12px rgba(249,115,22,0.30)",
  },
};

// Syncs an AI-driven freeze tool call into the global store + deposit history
function FreezeSync({ id }: { id: string }) {
  const { freezeSubAndDeposit } = useAutopilot();
  useEffect(() => { freezeSubAndDeposit(id); }, [id, freezeSubAndDeposit]);
  return null;
}

function normalizeAssistantText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Spring preset for message bubbles
const msgSpring = { type: "spring" as const, damping: 26, stiffness: 340, mass: 0.8 };

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const { personaId } = useAutopilot();
  const bubbleStyle = USER_BUBBLE_BG[personaId] ?? USER_BUBBLE_BG.caring;

  if (isUser) {
    const textPart = message.parts.find((p) => p.type === "text");
    const text = textPart && "text" in textPart ? (textPart as { type: "text"; text: string }).text : "";
    if (!text) return null;
    return (
      <motion.div
        className="flex justify-end mb-2.5"
        initial={{ opacity: 0, x: 14, y: 6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={msgSpring}
      >
        <div
          className="text-white rounded-[18px] rounded-br-[6px] px-4 py-2.5 max-w-[80%] text-[14px] leading-snug"
          style={{
            background: bubbleStyle.gradient,
            boxShadow: bubbleStyle.shadow,
          }}
        >
          {text}
        </div>
      </motion.div>
    );
  }

  // Assistant — render parts
  return (
    <motion.div
      className="flex flex-col items-start gap-2 mb-2.5"
      initial={{ opacity: 0, x: -10, y: 6 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={msgSpring}
    >
      {message.parts.map((part, i) => {
        // Plain text
        if (part.type === "text") {
          const text = normalizeAssistantText((part as { type: "text"; text: string }).text);
          if (!text) return null;
          return (
            <div
              key={i}
              className="bg-white rounded-[18px] rounded-bl-[6px] px-4 py-3 max-w-[88%] text-[14px] text-[#111111] leading-[1.55] whitespace-pre-line"
              style={{
                boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {text}
            </div>
          );
        }

        // Tool calls — extract toolName + state + output from part
        const p = part as Record<string, unknown>;
        const toolName: string | null =
          typeof p.toolName === "string" ? p.toolName
          : typeof p.type === "string" && (p.type as string).startsWith("tool-")
            ? (p.type as string).slice(5)
            : null;

        if (!toolName) return null;
        if (p.state !== "output-available") return null;

        const output = p.output as Record<string, unknown> | undefined;
        if (!output) return null;

        if (toolName === "analyze_spending") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              <SpendingBreakdownCard
                periodLabel={output.periodLabel as string}
                total={output.total as number}
                topCategory={output.topCategory as string}
                categories={output.categories as { label: string; value: number; percent: number; color: string }[]}
              />
            </motion.div>
          );
        }

        if (toolName === "predict_cashflow") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              <CashflowWarningCard
                daysUntilSalary={output.daysUntilSalary as number}
                balance={output.balance as number}
                upcomingDebits={output.upcomingDebits as number}
                projectedShortfall={output.projectedShortfall as number}
                riskLevel={output.riskLevel as "ok" | "tight" | "gap"}
              />
            </motion.div>
          );
        }

        if (toolName === "manage_subscriptions" && (output.action as string) === "freeze" && output.success && output.id) {
          return <FreezeSync key={i} id={output.id as string} />;
        }

        if (toolName === "manage_subscriptions" && (output.action as string) === "list") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              <SubscriptionFreezeCard
                subscriptions={output.subscriptions as { id: string; name: string; amount: number; nextCharge: string; category: string; frozen?: boolean }[]}
                totalMonthly={output.totalMonthly as number}
                count={output.count as number}
              />
            </motion.div>
          );
        }

        if (toolName === "show_autopilot_summary") {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              <AutopilotJarCard
                total={output.total as number}
                apr={output.apr as number}
                goal={output.goal as { name: string; target: number; aiReason: string }}
                progressPct={output.progressPct as number}
                sources={output.sources as Record<string, number>}
                recentHistory={output.recentHistory as { reason: string; amount: number; dateISO: string; note: string }[]}
              />
            </motion.div>
          );
        }

        if (toolName === "find_in_mbank_catalog" && output.found) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              <MMarketCrossSellCard
                paidPrice={output.paidPrice as number}
                product={output.product as { name: string; price: number; imageUrl: string; category: string; rating: number; reviewCount: number; freeDelivery: boolean }}
                savings={output.savings as number}
                savingsPercent={output.savingsPercent as number}
              />
            </motion.div>
          );
        }

        return null;
      })}
    </motion.div>
  );
}
