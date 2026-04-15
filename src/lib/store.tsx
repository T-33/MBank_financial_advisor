"use client";

// Minimal React Context store for dynamic autopilot total + active persona.
// Only the total and persona are dynamic; static fields come from mockData.

import { createContext, useContext, useState, type ReactNode } from "react";
import { autopilotSavings, type PersonaId } from "./mockData";

type AutopilotCtx = {
  autopilotTotal: number;
  addToAutopilot: (amount: number) => void;
  personaId: PersonaId;
  setPersonaId: (id: PersonaId) => void;
  frozenSubIds: Set<string>;
  toggleFrozenSub: (id: string) => void;
  /** Idempotent add — used to sync server-frozen subs into client context. */
  addFrozenSub: (id: string) => void;
};

const AutopilotContext = createContext<AutopilotCtx | null>(null);

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [autopilotTotal, setAutopilotTotal] = useState(autopilotSavings.total);
  const [personaId, setPersonaId] = useState<PersonaId>("caring");
  const [frozenSubIds, setFrozenSubIds] = useState<Set<string>>(new Set());

  function addToAutopilot(amount: number) {
    setAutopilotTotal((prev) => prev + amount);
  }

  function toggleFrozenSub(id: string) {
    setFrozenSubIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addFrozenSub(id: string) {
    setFrozenSubIds((prev) => {
      if (prev.has(id)) return prev; // already frozen — no re-render
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <AutopilotContext.Provider value={{ autopilotTotal, addToAutopilot, personaId, setPersonaId, frozenSubIds, toggleFrozenSub, addFrozenSub }}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot(): AutopilotCtx {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error("useAutopilot must be used inside AutopilotProvider");
  return ctx;
}
