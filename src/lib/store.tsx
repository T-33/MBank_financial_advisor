"use client";

// React Context store for dynamic autopilot state, persona, and deposit history.

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { autopilotSavings, subscriptions, type PersonaId, type AutopilotHistoryReason } from "./mockData";
import { TODAY_ISO } from "./format";

// ── Types ────────────────────────────────────────────────────────────────────

export type DynamicHistoryEntry = {
  id: string;
  reason: AutopilotHistoryReason;
  amount: number;
  dateISO: string;
  note: string;
  timestamp: number;
};

type HistoryInput = Omit<DynamicHistoryEntry, "id" | "timestamp">;

type AutopilotCtx = {
  autopilotTotal: number;
  addToAutopilot: (amount: number, entry?: HistoryInput) => void;
  dynamicHistory: DynamicHistoryEntry[];
  personaId: PersonaId;
  setPersonaId: (id: PersonaId) => void;
  frozenSubIds: Set<string>;
  toggleFrozenSub: (id: string) => void;
  addFrozenSub: (id: string) => void;
  freezeSubAndDeposit: (id: string) => void;
};

// ── Provider ─────────────────────────────────────────────────────────────────

const AutopilotContext = createContext<AutopilotCtx | null>(null);

let entrySeq = 0;

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [autopilotTotal, setAutopilotTotal] = useState(autopilotSavings.total);
  const [personaId, setPersonaId] = useState<PersonaId>("caring");
  const [frozenSubIds, setFrozenSubIds] = useState<Set<string>>(new Set());
  const [dynamicHistory, setDynamicHistory] = useState<DynamicHistoryEntry[]>([]);

  const addToAutopilot = useCallback((amount: number, entry?: HistoryInput) => {
    setAutopilotTotal((prev) => prev + amount);
    if (entry) {
      setDynamicHistory((prev) => [
        { ...entry, id: `dyn-${++entrySeq}`, timestamp: Date.now() },
        ...prev,
      ]);
    }
  }, []);

  const toggleFrozenSub = useCallback((id: string) => {
    setFrozenSubIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addFrozenSub = useCallback((id: string) => {
    setFrozenSubIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const freezeSubAndDeposit = useCallback((id: string) => {
    // Check current state — if already frozen, skip (idempotent)
    setFrozenSubIds((prev) => {
      if (prev.has(id)) return prev; // already frozen, no-op
      const next = new Set(prev);
      next.add(id);

      // Add to deposit history (only when actually freezing for the first time)
      const sub = subscriptions.find((s) => s.id === id);
      if (sub) {
        setAutopilotTotal((t) => t + sub.amount);
        setDynamicHistory((h) => [
          {
            id: `dyn-${++entrySeq}`,
            reason: "frozen",
            amount: sub.amount,
            dateISO: TODAY_ISO,
            note: `${sub.name} — заморозил`,
            timestamp: Date.now(),
          },
          ...h,
        ]);
      }

      return next;
    });
  }, []);

  return (
    <AutopilotContext.Provider
      value={{
        autopilotTotal, addToAutopilot, dynamicHistory,
        personaId, setPersonaId,
        frozenSubIds, toggleFrozenSub, addFrozenSub, freezeSubAndDeposit,
      }}
    >
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot(): AutopilotCtx {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error("useAutopilot must be used inside AutopilotProvider");
  return ctx;
}
