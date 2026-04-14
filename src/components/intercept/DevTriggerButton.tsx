"use client";

// DevTriggerButton — dev-only floating button that fires a random pending transaction.
// Returns null in production. Place inside the phone shell.

import { pendingTransactions, type PendingTransaction } from "@/lib/mockData";

type Props = {
  onTrigger: (pending: PendingTransaction) => void;
};

export default function DevTriggerButton({ onTrigger }: Props) {
  if (process.env.NODE_ENV !== "development") return null;

  const handleClick = () => {
    const random = pendingTransactions[Math.floor(Math.random() * pendingTransactions.length)];
    onTrigger(random);
  };

  return (
    <button
      onClick={handleClick}
      title="Dev: симулировать трату"
      className="absolute bottom-[80px] right-2 z-[45] w-7 h-7 rounded-full flex items-center justify-center text-[14px] active:scale-90 transition-transform"
      style={{
        background: "rgba(251,191,36,0.85)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      💥
    </button>
  );
}
