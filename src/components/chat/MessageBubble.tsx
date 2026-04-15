"use client";

import { UIMessage } from "ai";
import { useEffect } from "react";
import CashflowWarningCard from "./cards/CashflowWarningCard";
import SpendingBreakdownCard from "./cards/SpendingBreakdownCard";
import SubscriptionFreezeCard from "./cards/SubscriptionFreezeCard";
import AutopilotJarCard from "./cards/AutopilotJarCard";
import { useAutopilot } from "@/lib/store";

type Props = { message: UIMessage };

// Syncs an AI-driven freeze tool call into the global store
function FreezeSync({ id }: { id: string }) {
  const { freezeSubscription } = useAutopilot();
  useEffect(() => { freezeSubscription(id); }, [id, freezeSubscription]);
  return null;
}

function normalizeAssistantText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    // User message — get text from parts
    const textPart = message.parts.find((p) => p.type === "text");
    const text = textPart && "text" in textPart ? (textPart as { type: "text"; text: string }).text : "";
    if (!text) return null;
    return (
      <div className="flex justify-end mb-2">
        <div className="bg-[#009C4D] text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] text-[14px] leading-snug">
          {text}
        </div>
      </div>
    );
  }

  // Assistant — render parts
  return (
    <div className="flex flex-col items-start gap-2 mb-2">
      {message.parts.map((part, i) => {
        // Plain text
        if (part.type === "text") {
          const text = normalizeAssistantText((part as { type: "text"; text: string }).text);
          if (!text) return null;
          return (
            <div
              key={i}
              className="bg-white border border-[#ECECEC] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-[14px] text-[#111111] leading-snug whitespace-pre-line shadow-sm"
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
            <div key={i}>
              <SpendingBreakdownCard
                periodLabel={output.periodLabel as string}
                total={output.total as number}
                topCategory={output.topCategory as string}
                categories={output.categories as { label: string; value: number; percent: number; color: string }[]}
              />
            </div>
          );
        }

        if (toolName === "predict_cashflow") {
          return (
            <div key={i}>
              <CashflowWarningCard
                daysUntilSalary={output.daysUntilSalary as number}
                balance={output.balance as number}
                upcomingDebits={output.upcomingDebits as number}
                projectedShortfall={output.projectedShortfall as number}
                riskLevel={output.riskLevel as "ok" | "tight" | "gap"}
              />
            </div>
          );
        }

        if (toolName === "manage_subscriptions" && (output.action as string) === "list") {
          return (
            <div key={i}>
              <SubscriptionFreezeCard
                subscriptions={output.subscriptions as { id: string; name: string; amount: number; nextCharge: string; category: string; frozen?: boolean }[]}
                totalMonthly={output.totalMonthly as number}
                count={output.count as number}
              />
            </div>
          );
        }

        if (toolName === "show_autopilot_summary") {
          return (
            <div key={i}>
              <AutopilotJarCard
                total={output.total as number}
                apr={output.apr as number}
                goal={output.goal as { name: string; target: number; aiReason: string }}
                progressPct={output.progressPct as number}
                sources={output.sources as Record<string, number>}
                recentHistory={output.recentHistory as { reason: string; amount: number; dateISO: string; note: string }[]}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
