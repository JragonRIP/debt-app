"use client";

import { LedgerProvider } from "@/context/LedgerContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LedgerProvider>{children}</LedgerProvider>;
}
