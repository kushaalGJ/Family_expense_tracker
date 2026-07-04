"use client";

import { createContext, useContext } from "react";
import type { ModeContextValue } from "@/lib/types/domain";

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({
  value,
  children,
}: {
  value: ModeContextValue;
  children: React.ReactNode;
}) {
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within a ModeProvider");
  return ctx;
}
