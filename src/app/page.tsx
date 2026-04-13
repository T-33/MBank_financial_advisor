// MBank Design Template — showcases the brand design system
// Use this as a reference when building new screens

export default function DesignTemplate() {
  return (
    // Outer shell — desktop centering
    <div className="min-h-screen bg-[#DCDCDC] flex items-center justify-center py-8">
      {/* Phone shell — 390px */}
      <div
        className="relative w-[390px] bg-[#F2F2F2] overflow-hidden flex flex-col"
        style={{
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-[#F2F2F2] flex-shrink-0">
          <span className="text-[13px] font-semibold text-[#111111]">15:16</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="#111111">
              <rect x="0" y="4" width="3" height="8" rx="0.8" opacity="0.4"/>
              <rect x="4" y="2.5" width="3" height="9.5" rx="0.8" opacity="0.6"/>
              <rect x="8" y="1" width="3" height="11" rx="0.8" opacity="0.8"/>
              <rect x="12" y="0" width="3" height="12" rx="0.8"/>
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <rect x="1" y="3" width="11" height="7" rx="1.5" stroke="#111111" strokeWidth="1.2"/>
              <rect x="12.5" y="4.5" width="1.5" height="4" rx="0.75" fill="#111111" opacity="0.4"/>
              <rect x="2" y="4" width="7" height="5" rx="0.8" fill="#009C4D"/>
            </svg>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-[64px]">

          {/* ── Page header ── */}
          <div className="flex items-center justify-between px-4 pt-2 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E0E0E0] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#999">
                  <circle cx="8" cy="5.5" r="2.8"/>
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeWidth="0" fill="#999"/>
                </svg>
              </div>
              <span className="text-[18px] font-bold text-[#111111]">Тимур <span className="text-[#009C4D]">›</span></span>
            </div>
            <div className="relative">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2a6 6 0 0 1 6 6v3l1.5 2.5H3.5L5 11V8a6 6 0 0 1 6-6Z" stroke="#111" strokeWidth="1.5"/>
                <path d="M8.5 17.5a2.5 2.5 0 0 0 5 0" stroke="#111" strokeWidth="1.5"/>
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E53E3E] rounded-full text-white text-[9px] font-bold flex items-center justify-center">2</span>
            </div>
          </div>

          {/* ── Balance card ── */}
          <div className="px-4 mb-3">
            <div
              className="rounded-[16px] p-4 anim-hidden animate-fade-up delay-1"
              style={{
                background: "linear-gradient(135deg, #009C4D 0%, #007E3A 100%)",
                boxShadow: "0 4px 20px rgba(0,156,77,0.35)",
              }}
            >
              <p className="text-white/70 text-[12px] font-medium mb-1">Основной счёт · ****4821</p>
              <p className="text-white text-[28px] font-bold leading-tight tracking-tight">
                38 450,00 <span className="text-[20px]">С</span>
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20">
                <div>
                  <p className="text-white/60 text-[11px]">Доход</p>
                  <p className="text-white text-[13px] font-semibold">+40 000 С</p>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div>
                  <p className="text-white/60 text-[11px]">Расходы</p>
                  <p className="text-white text-[13px] font-semibold">−20 030 С</p>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div>
                  <p className="text-white/60 text-[11px]">Кешбэк</p>
                  <p className="text-white text-[13px] font-semibold">+312 С</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div className="px-4 mb-4 anim-hidden animate-fade-up delay-2">
            <div className="mbank-card !p-3">
              <div className="grid grid-cols-4 gap-1">
                {[
                  { icon: "↑", label: "Перевод" },
                  { icon: "↓", label: "Пополнить" },
                  { icon: "⚡", label: "Платежи" },
                  { icon: "···", label: "Ещё" },
                ].map((a) => (
                  <button key={a.label} className="flex flex-col items-center gap-1.5 py-1 rounded-[10px] active:bg-[#F2F2F2] transition-colors">
                    <div className="mbank-icon !w-10 !h-10 text-white text-[16px] font-bold">
                      {a.icon}
                    </div>
                    <span className="text-[11px] text-[#111111] font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Financial analysis strip ── */}
          <div className="px-4 mb-4 anim-hidden animate-fade-up delay-2">
            <div className="mbank-card cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[15px] font-semibold text-[#111111]">За Апрель</p>
                  <p className="text-[12px] text-[#999]">Финансовый анализ</p>
                </div>
                <span className="text-[14px] font-semibold text-[#111111]">20 030 <span className="text-[#009C4D]">›</span></span>
              </div>
              {/* Horizontal spending bar */}
              <div className="h-2 rounded-full overflow-hidden flex gap-0.5">
                <div style={{ width: "35%", background: "#3B82F6", borderRadius: "4px 0 0 4px" }} />
                <div style={{ width: "33%", background: "#009C4D" }} />
                <div style={{ width: "14%", background: "#FABF00" }} />
                <div style={{ width: "14%", background: "#8B5CF6" }} />
                <div style={{ width: "4%",  background: "#E53E3E", borderRadius: "0 4px 4px 0" }} />
              </div>
              <div className="flex gap-3 mt-2">
                {[
                  { color: "#3B82F6", label: "Еда" },
                  { color: "#009C4D", label: "Покупки" },
                  { color: "#FABF00", label: "Кафе" },
                  { color: "#8B5CF6", label: "Счета" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-[10px] text-[#999]">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Upcoming bills ── */}
          <div className="px-4 mb-4 anim-hidden animate-fade-up delay-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[17px] font-bold text-[#111111]">Счета</p>
              <button className="text-[13px] text-[#009C4D] font-medium">Все</button>
            </div>
            <div className="mbank-card !p-0 overflow-hidden">
              {[
                { icon: "⚡", name: "Severelectro",   amount: "1 240 С", status: "Скоро",   statusClass: "badge-soon"     },
                { icon: "🔥", name: "Bishkekteploset", amount: "2 100 С", status: "Скоро",   statusClass: "badge-soon"     },
                { icon: "📡", name: "MegaCom",          amount: "650 С",   status: "Просроч.", statusClass: "badge-overdue"   },
              ].map((bill, i, arr) => (
                <div
                  key={bill.name}
                  className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "mbank-divider" : ""}`}
                >
                  <div className="mbank-icon !w-10 !h-10 text-[18px]">{bill.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#111111]">{bill.name}</p>
                    <span className={`badge ${bill.statusClass} mt-0.5`}>● {bill.status}</span>
                  </div>
                  <p className="text-[14px] font-bold text-[#111111]">{bill.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent transactions ── */}
          <div className="px-4 mb-4 anim-hidden animate-fade-up delay-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[17px] font-bold text-[#111111]">Транзакции</p>
              <button className="text-[13px] text-[#009C4D] font-medium">История</button>
            </div>
            <div className="mbank-card !p-0 overflow-hidden">
              {[
                { initials: "C",  name: "Carrefour",     cat: "Еда",      amount: "−3 200 С",  income: false },
                { initials: "З",  name: "Зарплата",      cat: "Доход",    amount: "+40 000 С", income: true  },
                { initials: "Z",  name: "Zia Restaurant", cat: "Кафе",    amount: "−1 800 С",  income: false },
                { initials: "Д",  name: "Dordoi Bazaar", cat: "Покупки",  amount: "−5 600 С",  income: false },
              ].map((tx, i, arr) => (
                <div
                  key={tx.name}
                  className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "mbank-divider" : ""}`}
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[14px] font-bold flex-shrink-0"
                    style={{ background: tx.income ? "rgba(0,156,77,0.12)" : "#F0F0F0", color: tx.income ? "#009C4D" : "#666" }}
                  >
                    {tx.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#111111] truncate">{tx.name}</p>
                    <p className="text-[12px] text-[#999]">{tx.cat}</p>
                  </div>
                  <p className={`text-[14px] font-bold ${tx.income ? "text-[#009C4D]" : "text-[#111111]"}`}>
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── AI Advisor card (placeholder for feature) ── */}
          <div className="px-4 mb-6 anim-hidden animate-fade-up delay-5">
            <div
              className="rounded-[16px] p-4 flex items-start gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(0,156,77,0.08) 0%, rgba(0,126,139,0.06) 100%)",
                border: "1px solid rgba(0,156,77,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "#009C4D" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                  <path d="M9 1.5L10.5 6.5L15.5 6.5L11.5 9.5L13 14.5L9 11.5L5 14.5L6.5 9.5L2.5 6.5L7.5 6.5Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#111111]">Финансовый советник</p>
                <p className="text-[12px] text-[#555] mt-0.5 leading-relaxed">
                  До зарплаты 6 дней. Осталось 38 450 С, но ещё выйдут счета на 3 990 С.
                </p>
                <button className="mt-2 text-[12px] font-semibold text-[#009C4D]">Открыть советника →</button>
              </div>
            </div>
          </div>

        </div>{/* end scrollable */}

        {/* ── Bottom navigation ── */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white flex items-center justify-around px-2 flex-shrink-0"
          style={{
            height: "64px",
            borderTop: "1px solid #E8E8E8",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Главная — active */}
          <button className="flex flex-col items-center gap-1 px-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="#009C4D">
              <path d="M3 10L11 3L19 10V19H14V14H8V19H3V10Z"/>
            </svg>
            <span className="text-[10px] font-medium text-[#009C4D]">Главная</span>
          </button>

          {/* Платежи */}
          <button className="flex flex-col items-center gap-1 px-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 4v14M4 11h14" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] text-[#8C8C8C]">Платежи</span>
          </button>

          {/* QR FAB — center */}
          <div className="flex flex-col items-center" style={{ marginTop: "-20px" }}>
            <button
              className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center"
              style={{
                background: "#FABF00",
                boxShadow: "0 4px 16px rgba(250,191,0,0.4)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="white">
                <rect x="3" y="3" width="8" height="8" rx="1.5"/>
                <rect x="15" y="3" width="8" height="8" rx="1.5"/>
                <rect x="3" y="15" width="8" height="8" rx="1.5"/>
                <rect x="15" y="15" width="4" height="4" rx="1"/>
                <rect x="20" y="15" width="3" height="3" rx="0.8"/>
                <rect x="15" y="20" width="3" height="3" rx="0.8"/>
                <rect x="19" y="19" width="4" height="4" rx="1"/>
              </svg>
            </button>
          </div>

          {/* Сервисы */}
          <button className="flex flex-col items-center gap-1 px-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#8C8C8C" strokeWidth="1.6"/>
              <rect x="13" y="3" width="6" height="6" rx="1.5" stroke="#8C8C8C" strokeWidth="1.6"/>
              <rect x="3" y="13" width="6" height="6" rx="1.5" stroke="#8C8C8C" strokeWidth="1.6"/>
              <rect x="13" y="13" width="6" height="6" rx="1.5" stroke="#8C8C8C" strokeWidth="1.6"/>
            </svg>
            <span className="text-[10px] text-[#8C8C8C]">Сервисы</span>
          </button>

          {/* Еще */}
          <button className="flex flex-col items-center gap-1 px-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="#8C8C8C">
              <circle cx="5" cy="11" r="2"/>
              <circle cx="11" cy="11" r="2"/>
              <circle cx="17" cy="11" r="2"/>
            </svg>
            <span className="text-[10px] text-[#8C8C8C]">Еще</span>
          </button>
        </div>

      </div>{/* end phone shell */}
    </div>
  );
}
