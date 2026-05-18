"use client";

import { Settings, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { LedgerSettings } from "@/lib/types";

interface SettingsPanelProps {
  open: boolean;
  settings: LedgerSettings;
  onClose: () => void;
  onSave: (settings: LedgerSettings) => void;
  onClearAllPayments: () => void;
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
  onClearAllPayments,
}: SettingsPanelProps) {
  const [totalDebt, setTotalDebt] = useState(String(settings.totalDebt));
  const [milestoneStep, setMilestoneStep] = useState(
    String(settings.milestoneStep)
  );
  const [repaymentActive, setRepaymentActive] = useState(
    settings.repaymentActive
  );
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (open) {
      setTotalDebt(String(settings.totalDebt));
      setMilestoneStep(String(settings.milestoneStep));
      setRepaymentActive(settings.repaymentActive);
      setConfirmClear(false);
    }
  }, [open, settings]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      totalDebt: Math.max(0, parseFloat(totalDebt) || 0),
      milestoneStep: Math.max(100, parseFloat(milestoneStep) || 500),
      repaymentActive,
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

          <div className="flex items-center justify-between gap-4 rounded-xl border border-chrome/20 bg-forest-950/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">
                Paying Dad back
              </p>
              <p className="mt-0.5 text-xs text-white/45">
                Off: log income only (30% used for projections). On: payments
                reduce your balance.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={repaymentActive}
              onClick={() => setRepaymentActive((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
                repaymentActive
                  ? "border-chrome/50 bg-chrome/25"
                  : "border-chrome/25 bg-forest-950"
              }`}
            >
              <span
                className={`absolute top-0.5 block h-5 w-5 rounded-full bg-chrome-bright shadow transition ${
                  repaymentActive ? "left-[1.35rem]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button type="submit" className="chrome-button w-full">
            Save Settings
          </button>
        </form>

        <div className="mt-8 border-t border-chrome/15 pt-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-chrome/70">
            Danger zone
          </p>
          <p className="mb-4 text-xs text-white/45">
            Removes all income and payment history and clears calculator
            pre-fills. Debt total, milestone, and the paying-Dad toggle stay
            the same.
          </p>
          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="w-full rounded-xl border border-red-400/35 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-200 transition hover:border-red-400/55 hover:bg-red-950/60"
            >
              Clear all payments
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-200/90">
                This cannot be undone. Delete all payment history?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 rounded-xl border border-chrome/25 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-chrome/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAllPayments();
                    setConfirmClear(false);
                    onClose();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/50 bg-red-600/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Yes, clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
