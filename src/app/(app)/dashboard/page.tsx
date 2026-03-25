import { user, bills, spendingByCategory, transactions } from "@/lib/mock-data";
import SpendingChart from "@/components/SpendingChart";

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const categoryEmoji: Record<string, string> = {
  Income: "💰", Food: "🛒", Dining: "🍽️", Shopping: "🛍️", Transport: "🚌", Health: "💊",
};

export default function DashboardPage() {
  const upcomingBills = bills.filter((b) => b.status !== "overdue").slice(0, 4);
  const overdueBills = bills.filter((b) => b.status === "overdue");
  const totalSpent = spendingByCategory.filter(c => c.category !== "Income").reduce((s, c) => s + c.amount, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up opacity-0-init">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">March 2026</p>
        <h1 className="text-white font-semibold text-2xl tracking-tight">
          Good morning, {user.name.split(" ")[0]}
        </h1>
      </div>

      {/* Overdue alert */}
      {overdueBills.length > 0 && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-up opacity-0-init delay-50"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <span className="text-red-400 text-lg">⚠</span>
          <div className="flex-1">
            <p className="text-red-300 text-sm font-medium">
              {overdueBills.map((b) => b.name).join(", ")} — overdue
            </p>
          </div>
          <a
            href="/bills"
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#FCA5A5",
            }}
          >
            Pay now →
          </a>
        </div>
      )}

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Balance — hero card */}
        <div
          className="glass-card grain rounded-2xl p-6 col-span-1 animate-fade-up opacity-0-init delay-100"
          style={{
            background: "linear-gradient(135deg, rgba(15,30,54,0.95) 0%, rgba(10,22,40,0.95) 100%)",
          }}
        >
          <p className="text-white/30 text-[11px] uppercase tracking-widest mb-3">Total Balance</p>
          <p className="num text-white font-bold leading-none mb-1" style={{ fontSize: "32px", letterSpacing: "-0.02em" }}>
            {fmt(user.balance)}
          </p>
          <p className="text-white/30 text-sm">KGS · {user.accountNumber}</p>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex justify-between text-xs">
              <span className="text-white/25">Monthly income</span>
              <span className="text-white/50 font-medium">{fmt(user.monthlyIncome)} KGS</span>
            </div>
          </div>
        </div>

        {/* Spent */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up opacity-0-init delay-150">
          <p className="text-white/30 text-[11px] uppercase tracking-widest mb-3">Spent This Month</p>
          <p className="num text-white font-bold leading-none mb-1" style={{ fontSize: "28px", letterSpacing: "-0.02em" }}>
            {fmt(totalSpent)}
          </p>
          <p className="text-white/30 text-sm">KGS</p>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (totalSpent / user.monthlyIncome) * 100)}%`,
                  background: "linear-gradient(90deg, #F5B040, #E09420)",
                  boxShadow: "0 0 8px rgba(245,176,64,0.4)",
                }}
              />
            </div>
            <p className="text-white/25 text-xs mt-1.5">{Math.round((totalSpent / user.monthlyIncome) * 100)}% of income</p>
          </div>
        </div>

        {/* Bills due */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up opacity-0-init delay-200">
          <p className="text-white/30 text-[11px] uppercase tracking-widest mb-3">Bills Due</p>
          <p className="num font-bold leading-none mb-1" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#F5B040" }}>
            {fmt(upcomingBills.reduce((s, b) => s + b.amount, 0))}
          </p>
          <p className="text-white/30 text-sm">KGS</p>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/25 text-xs">{upcomingBills.length} upcoming payments</p>
          </div>
        </div>
      </div>

      {/* Chart + Bills */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Spending chart */}
        <div className="glass-card rounded-2xl p-6 col-span-3 animate-fade-up opacity-0-init delay-250">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/60 text-sm font-medium">Spending Breakdown</p>
            <span className="text-white/20 text-xs">March 2026</span>
          </div>
          <SpendingChart data={spendingByCategory} />
        </div>

        {/* Bills */}
        <div className="glass-card rounded-2xl p-6 col-span-2 animate-fade-up opacity-0-init delay-300">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/60 text-sm font-medium">Upcoming Bills</p>
            <a href="/bills" className="text-[11px] transition-colors duration-200" style={{ color: "#F5B040" }}>
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {upcomingBills.map((bill) => {
              const days = daysUntil(bill.dueDate);
              const urgent = days <= 3;
              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{bill.icon}</span>
                    <div>
                      <p className="text-white/70 text-sm font-medium leading-tight">{bill.name}</p>
                      <p className={`text-xs leading-tight mt-0.5 ${urgent ? "text-red-400" : "text-white/25"}`}>
                        {days <= 0 ? "Today" : `${days}d`}
                      </p>
                    </div>
                  </div>
                  <span className="num text-white/60 text-sm font-semibold">{fmt(bill.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up opacity-0-init delay-350">
        <p className="text-white/60 text-sm font-medium mb-5">Recent Transactions</p>
        <div className="space-y-1">
          {transactions.slice(0, 7).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors duration-150 hover:bg-white/[0.03] group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {categoryEmoji[tx.category] ?? "💳"}
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium leading-tight">{tx.description}</p>
                  <p className="text-white/25 text-xs mt-0.5">{tx.category} · {tx.date}</p>
                </div>
              </div>
              <span
                className="num text-sm font-semibold"
                style={{ color: tx.amount > 0 ? "#6EE7B7" : "#94A3B8" }}
              >
                {tx.amount > 0 ? "+" : ""}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
