"use client";

import { useState } from "react";
import { savingsGoals } from "@/lib/mock-data";

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function monthsUntil(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.max(0, (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth()));
}

const goalColors = ["#F5B040", "#60A5FA", "#A78BFA", "#34D399"];

export default function SavingsPage() {
  const [goals, setGoals] = useState(savingsGoals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", targetAmount: "", deadline: "" });

  function addGoal() {
    if (!form.name || !form.targetAmount || !form.deadline) return;
    setGoals((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: form.name,
        targetAmount: Number(form.targetAmount),
        savedAmount: 0,
        deadline: form.deadline,
        icon: "🎯",
        color: "#A78BFA",
      },
    ]);
    setForm({ name: "", targetAmount: "", deadline: "" });
    setShowForm(false);
  }

  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const overallPct = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up opacity-0-init">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Goals</p>
          <h1 className="text-white font-semibold text-2xl tracking-tight">Savings Planner</h1>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
          style={{
            background: showForm ? "rgba(255,255,255,0.05)" : "rgba(245,176,64,0.12)",
            border: showForm ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(245,176,64,0.25)",
            color: showForm ? "rgba(255,255,255,0.4)" : "#F5B040",
          }}
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Overall progress */}
      <div
        className="glass-card grain rounded-2xl p-6 mb-6 animate-fade-up opacity-0-init delay-50"
        style={{
          background: "linear-gradient(135deg, rgba(15,30,54,0.95) 0%, rgba(10,22,40,0.95) 100%)",
        }}
      >
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest mb-2">Total Saved</p>
            <p className="num text-white font-bold leading-none" style={{ fontSize: "30px", letterSpacing: "-0.02em" }}>
              {fmt(totalSaved)}
            </p>
            <p className="text-white/30 text-sm mt-1">of {fmt(totalTarget)} KGS target</p>
          </div>
          <p className="num font-bold" style={{ fontSize: "40px", color: "#F5B040", lineHeight: 1, letterSpacing: "-0.03em" }}>
            {overallPct}%
          </p>
        </div>
        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${overallPct}%`,
              background: "linear-gradient(90deg, #F5B040, #E09420)",
              boxShadow: "0 0 12px rgba(245,176,64,0.5)",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-white/20 text-xs">{fmt(totalSaved)} KGS saved</p>
          <p className="text-white/20 text-xs">{fmt(totalTarget - totalSaved)} KGS to go</p>
        </div>
      </div>

      {/* New goal form */}
      {showForm && (
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-in"
          style={{
            background: "rgba(245,176,64,0.04)",
            border: "1px solid rgba(245,176,64,0.15)",
          }}
        >
          <p className="text-white/50 text-sm font-medium mb-4">New Savings Goal</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Goal Name", key: "name", placeholder: "e.g. Emergency Fund", type: "text" },
              { label: "Amount (KGS)", key: "targetAmount", placeholder: "50000", type: "number" },
              { label: "Deadline", key: "deadline", placeholder: "", type: "date" },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <p className="text-white/25 text-[11px] mb-1.5 uppercase tracking-wider">{label}</p>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full text-sm text-white/80 rounded-xl px-3 py-2.5 focus:outline-none transition-colors duration-150"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={addGoal}
            className="text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(245,176,64,0.15)",
              border: "1px solid rgba(245,176,64,0.3)",
              color: "#F5B040",
            }}
          >
            Create Goal →
          </button>
        </div>
      )}

      {/* Goals */}
      <div className="space-y-3">
        {goals.map((goal, i) => {
          const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const months = monthsUntil(goal.deadline);
          const monthly = months > 0
            ? Math.ceil((goal.targetAmount - goal.savedAmount) / months)
            : goal.targetAmount - goal.savedAmount;
          const color = goalColors[i % goalColors.length];

          return (
            <div
              key={goal.id}
              className="glass-card rounded-2xl p-5 transition-all duration-200 hover:bg-white/[0.02]"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                  >
                    {goal.icon}
                  </div>
                  <div>
                    <p className="text-white/80 font-medium text-sm">{goal.name}</p>
                    <p className="text-white/25 text-xs mt-0.5">
                      {months > 0 ? `${months} months left` : "Past deadline"} · {goal.deadline}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="num font-bold text-lg leading-none" style={{ color, letterSpacing: "-0.02em" }}>
                    {pct}%
                  </p>
                  <p className="text-white/25 text-xs mt-0.5">
                    {fmt(goal.savedAmount)} / {fmt(goal.targetAmount)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="h-1.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: color,
                    boxShadow: `0 0 10px ${color}60`,
                  }}
                />
              </div>

              <p className="text-white/25 text-xs">
                Save <span className="font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{fmt(monthly)} KGS/month</span> to reach your goal
              </p>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div
        className="mt-4 p-4 rounded-2xl animate-fade-up opacity-0-init"
        style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.1)" }}
      >
        <p className="text-white/35 text-sm">
          💡 With <span className="text-blue-400 font-medium">mInvest</span>, your saved funds earn ~10% annually instead of sitting idle.{" "}
          <a href="/discover" style={{ color: "#60A5FA" }}>Activate →</a>
        </p>
      </div>
    </div>
  );
}
