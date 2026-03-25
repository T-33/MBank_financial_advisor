"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { user } from "@/lib/mock-data";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
      </svg>
    ),
  },
  {
    href: "/bills",
    label: "Bills",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/savings",
    label: "Savings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5.5v5M5.5 8h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/assistant",
    label: "AI Advisor",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-3 2v-2H4a2 2 0 0 1-2-2V4Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 7h5M5.5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/discover",
    label: "Discover",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6 6.5 7.5 5 11l3.5-1.5L10 6Z" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="grain w-60 min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020912 0%, #030D1E 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-900 font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #F5B040 0%, #E09420 100%)",
              boxShadow: "0 2px 8px rgba(245,176,64,0.4)",
            }}
          >
            M
          </div>
          <div>
            <div className="text-white font-semibold text-sm tracking-tight leading-none">MBank</div>
            <div className="text-white/30 text-[10px] mt-0.5 leading-none font-light tracking-wide uppercase">Advisor</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(245,176,64,0.25) 0%, rgba(245,176,64,0.08) 100%)",
              border: "1px solid rgba(245,176,64,0.25)",
              color: "#F5B040",
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white/80 text-sm font-medium truncate leading-tight">{user.name.split(" ")[0]}</p>
            <p className="text-white/25 text-xs mt-0.5 leading-none">{user.accountNumber}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-white/20 text-[10px] uppercase tracking-widest font-medium px-3 pb-2">Menu</p>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (pathname === "/" && item.href === "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-200 relative",
                active
                  ? "text-white"
                  : "text-white/35 hover:text-white/70 hover:bg-white/5"
              )}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(245,176,64,0.12) 0%, rgba(245,176,64,0.04) 100%)",
                      border: "1px solid rgba(245,176,64,0.15)",
                    }
                  : {}
              }
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: "#F5B040", boxShadow: "0 0 8px rgba(245,176,64,0.6)" }}
                />
              )}
              <span className={active ? "text-gold-400" : ""}>{item.icon}</span>
              <span className="font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Balance */}
      <div
        className="px-5 py-5 mx-3 mb-5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(245,176,64,0.1) 0%, rgba(245,176,64,0.03) 100%)",
          border: "1px solid rgba(245,176,64,0.12)",
        }}
      >
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Available Balance</p>
        <p className="num text-white font-bold leading-none" style={{ fontSize: "22px" }}>
          {user.balance.toLocaleString("ru-RU")}
        </p>
        <p className="text-white/30 text-xs mt-1">KGS</p>
      </div>
    </aside>
  );
}
