"use client";

import { Settings, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  normalizeDebtSharePercent,
  type LedgerSettings,
} from "@/lib/types";

interface SettingsPanelProps {
  open: boolean;
  settings: LedgerSettings;
  onClose: () => void;
  onSave: (settings: LedgerSettings) => void;
  onClearAllPayments: () => void;
}

const inputClass =
  "w-full rounded-xl border border-bronze/30 bg-dash-950/80 px-4 py-3 font-digital text-lg text-dash-green outline-none transition focus:border-dash-green/50 focus:ring-2 focus:ring-dash-green/20";

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze/40 bg-dash-900/90 text-bronze-bright shadow-lg transition hover:border-dash-green/50 hover:text-dash-green"
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
  if (!open) return null;

  return (
    <SettingsForm
      settings={settings}
      onClose={onClose}
      onSave={onSave}
      onClearAllPayments={onClearAllPayments}
    />
  );
}

function SettingsForm({
  settings,
  onClose,
  onSave,
  onClearAllPayments,
}: Omit<SettingsPanelProps, "open">) {
  const [totalDebt, setTotalDebt] = useState(String(settings.totalDebt));
  const [milestoneStep, setMilestoneStep] = useState(
    String(settings.milestoneStep)
  );
  const [debtSharePercent, setDebtSharePercent] = useState(
    settings.debtSharePercent
  );
  const [confirmClear, setConfirmClear] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      totalDebt: Math.max(0, parseFloat(totalDebt) || 0),
      milestoneStep: Math.max(100, parseFloat(milestoneStep) || 500),
      debtSharePercent: normalizeDebtSharePercent(debtSharePercent),
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
      <div className="relative z-10 w-full max-w-md rounded-t-3xl border border-bronze/30 bg-dash-900 p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-bronze-bright">
            Ledger Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-bronze-bright/80 transition hover:bg-bronze/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
              Starting note ($)
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
              Original balance. Extra borrows are logged on the Pay tab and
              stack on top of this.
            </p>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
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

          <div className="rounded-xl border border-bronze/25 bg-dash-950/50 px-4 py-3">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Percent to the note</p>
                <p className="mt-0.5 text-xs text-white/45">
                  Share of net job earnings for debt
                </p>
              </div>
              <p className="font-digital text-xl font-semibold text-dash-green tabular-nums">
                {debtSharePercent}%
              </p>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={debtSharePercent}
              onChange={(e) => setDebtSharePercent(Number(e.target.value))}
              className="debt-share-slider w-full"
              aria-label="Percent of net earnings toward debt"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-white/40">
              <span>1%</span>
              <span>100%</span>
            </div>
          </div>

          <button type="submit" className="dash-button w-full">
            Save Settings
          </button>
        </form>

        <div className="mt-8 border-t border-bronze/20 pt-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
            Danger zone
          </p>
          <p className="mb-4 text-xs text-white/45">
            Removes all payment and borrow history. Starting note and
            milestone stay the same.
          </p>
          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="w-full rounded-xl border border-red-400/35 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-200 transition hover:border-red-400/55 hover:bg-red-950/60"
            >
              Clear all entries
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-200/90">
                This cannot be undone. Delete all ledger history?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 rounded-xl border border-bronze/25 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-bronze/10"
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
