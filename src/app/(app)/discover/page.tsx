"use client";

import { useState } from "react";
import { mbankFeatures } from "@/lib/mock-data";

const featureColors = [
  { accent: "#F5B040", bg: "rgba(245,176,64,0.08)", border: "rgba(245,176,64,0.15)" },
  { accent: "#60A5FA", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.15)" },
  { accent: "#A78BFA", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)" },
  { accent: "#34D399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.15)" },
];

export default function DiscoverPage() {
  const [features, setFeatures] = useState(mbankFeatures);
  const [activating, setActivating] = useState<string | null>(null);

  function handleActivate(id: string) {
    setActivating(id);
    setTimeout(() => {
      setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, activated: true } : f)));
      setActivating(null);
    }, 1000);
  }

  const activatedCount = features.filter((f) => f.activated).length;
  const pct = Math.round((activatedCount / features.length) * 100);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up opacity-0-init">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Platform</p>
        <h1 className="text-white font-semibold text-2xl tracking-tight">Discover MBank</h1>
        <p className="text-white/30 text-sm mt-1">{activatedCount} of {features.length} features active</p>
      </div>

      {/* Progress hero */}
      <div
        className="grain glass-card rounded-2xl p-6 mb-8 animate-fade-up opacity-0-init delay-50"
        style={{ background: "linear-gradient(135deg, rgba(15,30,54,0.95) 0%, rgba(10,22,40,0.95) 100%)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest mb-2">Activation Score</p>
            <p className="num text-white font-bold" style={{ fontSize: "28px", letterSpacing: "-0.02em" }}>
              {activatedCount}/{features.length} Features
            </p>
          </div>
          <p className="num font-bold" style={{ fontSize: "44px", color: "#F5B040", lineHeight: 1, letterSpacing: "-0.03em" }}>
            {pct}%
          </p>
        </div>
        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #F5B040, #E09420)",
              boxShadow: "0 0 12px rgba(245,176,64,0.5)",
            }}
          />
        </div>
        {pct < 100 && (
          <p className="text-white/20 text-xs mt-3">
            Activate the remaining features to unlock your full financial potential
          </p>
        )}
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, i) => {
          const colors = featureColors[i % featureColors.length];
          const isActivating = activating === feature.id;

          return (
            <div
              key={feature.id}
              className="glass-card rounded-2xl p-5 transition-all duration-200 animate-fade-up opacity-0-init"
              style={{
                animationDelay: `${100 + i * 80}ms`,
                ...(feature.activated
                  ? { border: `1px solid ${colors.border}`, background: colors.bg }
                  : {}),
              }}
            >
              {/* Feature icon + status */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                >
                  {feature.icon}
                </div>
                {feature.activated && (
                  <span
                    className="text-[10px] font-medium px-2 py-1 rounded-full"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.accent }}
                  >
                    ● Active
                  </span>
                )}
              </div>

              <h3 className="text-white/80 font-semibold text-sm mb-1.5">{feature.name}</h3>
              <p className="text-white/35 text-xs leading-relaxed mb-4">{feature.description}</p>

              {/* Benefit */}
              <div
                className="text-xs px-3 py-2 rounded-xl mb-4"
                style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.accent }}
              >
                💡 {feature.benefit}
              </div>

              {/* CTA */}
              <button
                onClick={() => !feature.activated && handleActivate(feature.id)}
                disabled={isActivating}
                className="w-full text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                style={
                  feature.activated
                    ? {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.35)",
                      }
                    : {
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.accent,
                        boxShadow: isActivating ? `0 0 16px ${colors.accent}40` : "none",
                      }
                }
              >
                {isActivating ? "Activating…" : feature.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
