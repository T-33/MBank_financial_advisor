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
};

const AutopilotContext = createContext<AutopilotCtx | null>(null);

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [autopilotTotal, setAutopilotTotal] = useState(autopilotSavings.total);
  const [personaId, setPersonaId] = useState<PersonaId>("caring");

  function addToAutopilot(amount: number) {
    setAutopilotTotal((prev) => prev + amount);
  }

  return (
    <AutopilotContext.Provider value={{ autopilotTotal, addToAutopilot, personaId, setPersonaId }}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot(): AutopilotCtx {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error("useAutopilot must be used inside AutopilotProvider");
  return ctx;
}
