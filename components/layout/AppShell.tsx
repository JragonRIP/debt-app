"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { SettingsButton, SettingsPanel } from "@/components/SettingsPanel";
import { useLedger } from "@/context/LedgerContext";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Impala Ledger", subtitle: "Buy-back dashboard" },
  "/pay": { title: "Log Payment", subtitle: "Record a new payment" },
  "/calculator": { title: "Revenue Split", subtitle: "Detailing job calculator" },
  "/history": { title: "Payment History", subtitle: "Tap a row for details" },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, updateSettings, clearAllPayments, repaymentActive } =
    useLedger();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const baseMeta = pageTitles[pathname] ?? pageTitles["/"];
  const meta =
    pathname === "/pay"
      ? {
          ...baseMeta,
          title: repaymentActive ? "Log Payment" : "Log Income",
          subtitle: repaymentActive
            ? "Record a payment to Dad"
            : `Track job earnings (${settings.debtSharePercent}% used in projections)`,
        }
      : baseMeta;

  return (
    <>
      <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-safe sm:max-w-xl">
        <header className="mb-6 flex items-start justify-between gap-4 pt-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              {meta.title}
            </h1>
            <p className="text-sm text-white/50">{meta.subtitle}</p>
          </div>
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </header>
        {children}
      </div>

      <BottomNav />

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={updateSettings}
        onClearAllPayments={clearAllPayments}
      />
    </>
  );
}
