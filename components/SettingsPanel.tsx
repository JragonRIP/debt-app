"use client";

import { Settings, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { LedgerSettings } from "@/lib/types";

interface SettingsPanelProps {
  open: boolean;
  settings: LedgerSettings;
  onClose: () => void;
  onSave: (settings: LedgerSettings) => void;
}

const inputClass =
  "w-full rounded-xl border border-chrome/25 bg-forest-950/80 px-4 py-3 text-white outline-none transition focus:border-chrome/60 focus:ring-2 focus:ring-chrome/20";

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-chrome/35 bg-forest-900/90 text-chrome-bright shadow-lg transition hover:border-chrome/60 hover:bg-chrome/10"
      aria-label="Open settings"
    >
      <Settings className="h-5 w-5" />
    </button>
  );
}

export function SettingsPanel({
  open,
  settings,
  onClose,
  onSave,
}: SettingsPanelProps) {
  const [totalDebt, setTotalDebt] = useState(String(settings.totalDebt));
  const [milestoneStep, setMilestoneStep] = useState(
    String(settings.milestoneStep)
  );

  useEffect(() => {
    if (open) {
      setTotalDebt(String(settings.totalDebt));
      setMilestoneStep(String(settings.milestoneStep));
    }
  }, [open, settings]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      totalDebt: Math.max(0, parseFloat(totalDebt) || 0),
      milestoneStep: Math.max(100, parseFloat(milestoneStep) || 500),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close settings"
      />
      <div className="relative z-10 w-full max-w-md rounded-t-3xl border border-chrome/30 bg-forest-900 p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">
            Ledger Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-chrome/80 transition hover:bg-chrome/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-chrome/70">
              Total Debt Amount ($)
            </span>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={totalDebt}
              onChange={(e) => setTotalDebt(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-white/45">
              Original buy-back balance from Dad
            </p>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-chrome/70">
              Milestone Step ($)
            </span>
            <input
              type="number"
              min="100"
              step="50"
              required
              value={milestoneStep}
              onChange={(e) => setMilestoneStep(e.target.value)}
              className={inputClass}
            />
          </label>

          <button type="submit" className="chrome-button w-full">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
