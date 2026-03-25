"use client";

import { useState } from "react";
import { bills } from "@/lib/mock-data";

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

type BillStatus = "overdue" | "due_soon" | "upcoming" | "paid";

const statusStyle: Record<BillStatus, { label: string; dot: string; text: string; bg: string }> = {
  overdue:  { label: "Overdue",   dot: "#EF4444", text: "#FCA5A5", bg: "rgba(239,68,68,0.08)"  },
  due_soon: { label: "Due Soon",  dot: "#F5B040", text: "#FCD34D", bg: "rgba(245,176,64,0.08)" },
  upcoming: { label: "Upcoming",  dot: "#60A5FA", text: "#93C5FD", bg: "rgba(96,165,250,0.06)" },
  paid:     { label: "Paid",      dot: "#34D399", text: "#6EE7B7", bg: "rgba(52,211,153,0.06)" },
};

export default function BillsPage() {
  const [statuses, setStatuses] = useState<Record<string, BillStatus>>(
    Object.fromEntries(bills.map((b) => [b.id, b.status as BillStatus]))
  );
  const [paying, setPaying] = useState<string | null>(null);

  function handlePay(id: string) {
    setPaying(id);
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: "paid" }));
      setPaying(null);
    }, 1200);
  }

  const totalDue = bills.filter((b) => statuses[b.id] !== "paid").reduce((s, b) => s + b.amount, 0);
  const overdueCount = bills.filter((b) => statuses[b.id] === "overdue").length;
  const paidCount = bills.filter((b) => statuses[b.id] === "paid").length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up opacity-0-init">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Payments</p>
        <h1 className="text-white font-semibold text-2xl tracking-tight">Bills & Utilities</h1>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="glass-card rounded-2xl p-5 animate-fade-up opacity-0-init delay-50">
          <p className="text-white/30 text-[11px] uppercase tracking-widest mb-2">Total Due</p>
          <p className="num text-white font-bold" style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
            {totalDue.toLocaleString("ru-RU")}
          </p>
          <p className="text-white/25 text-xs mt-0.5">KGS remaining</p>
        </div>
        <div className="glass-card rounded-2xl p-5 animate-fade-up opacity-0-init delay-100">
          <p className="text-white/30 text-[11px] uppercase tracking-widest mb-2">Overdue</p>
          <p className="num font-bold" style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#FCA5A5" }}>
            {overdueCount}
          </p>
          <p className="text-white/25 text-xs mt-0.5">bill{overdueCount !== 1 ? "s" : ""} unpaid</p>
        </div>
        <div className="glass-card rounded-2xl p-5 animate-fade-up opacity-0-init delay-150">
          <p className="text-white/30 text-[11px] uppercase tracking-widest mb-2">Paid</p>
          <p className="num font-bold" style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#6EE7B7" }}>
            {paidCount}
          </p>
          <p className="text-white/25 text-xs mt-0.5">this month</p>
        </div>
      </div>

      {/* Bills list */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-up opacity-0-init delay-200">
        {bills.map((bill, i) => {
          const status = statuses[bill.id];
          const s = statusStyle[status];
          const days = daysUntil(bill.dueDate);
          const isPaid = status === "paid";

          return (
            <div
              key={bill.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors duration-150 hover:bg-white/[0.02]"
              style={{
                borderBottom: i < bills.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined,
              }}
            >
              {/* Left accent */}
              <div
                className="w-0.5 h-10 rounded-full flex-shrink-0"
                style={{
                  background: s.dot,
                  boxShadow: `0 0 8px ${s.dot}80`,
                }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {bill.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white/80 text-sm font-medium">{bill.name}</p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="text-white/25 text-xs">
                  {bill.category} ·{" "}
                  {isPaid
                    ? "Paid"
                    : days < 0
                    ? `${Math.abs(days)}d overdue`
                    : days === 0
                    ? "Due today"
                    : `Due in ${days}d`}
                </p>
              </div>

              {/* Amount + action */}
              <div className="text-right flex-shrink-0">
                <p className="num text-white/70 font-semibold text-sm mb-2">
                  {bill.amount.toLocaleString("ru-RU")} KGS
                </p>
                {isPaid ? (
                  <span className="text-xs font-medium" style={{ color: "#6EE7B7" }}>✓ Paid</span>
                ) : (
                  <button
                    onClick={() => handlePay(bill.id)}
                    disabled={paying === bill.id}
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: status === "overdue"
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(245,176,64,0.12)",
                      border: status === "overdue"
                        ? "1px solid rgba(239,68,68,0.3)"
                        : "1px solid rgba(245,176,64,0.25)",
                      color: status === "overdue" ? "#FCA5A5" : "#F5B040",
                    }}
                  >
                    {paying === bill.id ? "Processing…" : "Pay"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-pay nudge */}
      <div
        className="mt-4 p-4 rounded-2xl flex items-center gap-3 animate-fade-up opacity-0-init delay-300"
        style={{ background: "rgba(245,176,64,0.05)", border: "1px solid rgba(245,176,64,0.1)" }}
      >
        <span className="text-xl">🔄</span>
        <p className="text-white/40 text-sm flex-1">
          Activate <span className="text-gold-400 font-medium">Auto-Pay</span> to never miss a bill deadline.
        </p>
        <a
          href="/discover"
          className="text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: "#F5B040", background: "rgba(245,176,64,0.1)", border: "1px solid rgba(245,176,64,0.15)" }}
        >
          Enable →
        </a>
      </div>
    </div>
  );
}
