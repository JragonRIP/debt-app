"use client";

import { DollarSign, Calendar } from "lucide-react";
import { FormEvent, useState } from "react";
import type { LedgerEntryKind } from "@/lib/types";

export interface PaymentDraft {
  amount: string;
  description: string;
  date: string;
  kind: LedgerEntryKind;
}

interface LogPaymentFormProps {
  onSubmit: (
    draft: PaymentDraft
  ) => void | Promise<{ emailed?: boolean; emailError?: string } | void>;
  suggestedAmount?: number | null;
  suggestedDescription?: string | null;
  suggestedKind?: LedgerEntryKind | null;
  onClearSuggestion?: () => void;
}

const inputClass =
  "w-full rounded-xl border border-bronze/30 bg-dash-950/80 px-4 py-3 font-digital text-lg tracking-wide text-dash-green placeholder:text-dash-green/30 outline-none transition focus:border-dash-green/50 focus:ring-2 focus:ring-dash-green/20";

export function LogPaymentForm({
  onSubmit,
  suggestedAmount,
  suggestedDescription,
  suggestedKind,
  onClearSuggestion,
}: LogPaymentFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [kind, setKind] = useState<LedgerEntryKind>(
    suggestedKind === "borrow" ? "borrow" : "debt_payment"
  );
  const [amount, setAmount] = useState(
    suggestedAmount != null && suggestedAmount > 0
      ? suggestedAmount.toFixed(2)
      : ""
  );
  const [description, setDescription] = useState(suggestedDescription ?? "");
  const [date, setDate] = useState(today);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeKind, setNoticeKind] = useState<"ok" | "warn">("ok");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount || !description.trim() || busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const result = await onSubmit({
        amount,
        description: description.trim(),
        date,
        kind,
      });
      onClearSuggestion?.();
      setAmount("");
      setDescription("");
      setDate(today);
      if (kind === "debt_payment") {
        if (result && "emailed" in result && result.emailed) {
          setNoticeKind("ok");
          setNotice("Logged. Dad was emailed the amount, remaining balance, and expected payoff date.");
        } else {
          setNoticeKind("warn");
          setNotice(
            result && "emailError" in result && result.emailError
              ? `Logged locally, but the email did not send: ${result.emailError}`
              : "Logged locally, but the email did not send."
          );
        }
      } else {
        setNoticeKind("ok");
        setNotice("Added to the note. No email is sent for extra borrows.");
      }
    } finally {
      setBusy(false);
    }
  }

  const isBorrow = kind === "borrow";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setKind("debt_payment")}
          className={`rounded-xl border px-3 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            !isBorrow
              ? "border-dash-green/50 bg-dash-green/15 text-dash-green shadow-[0_0_16px_rgba(57,255,120,0.18)]"
              : "border-bronze/25 bg-dash-950/40 text-white/45 hover:text-white/70"
          }`}
        >
          Payment
        </button>
        <button
          type="button"
          onClick={() => setKind("borrow")}
          className={`rounded-xl border px-3 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            isBorrow
              ? "border-bronze/70 bg-bronze/20 text-bronze-bright shadow-[0_0_16px_rgba(196,146,74,0.22)]"
              : "border-bronze/25 bg-dash-950/40 text-white/45 hover:text-white/70"
          }`}
        >
          Add Debt
        </button>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
          <DollarSign className="h-3.5 w-3.5" />
          {isBorrow ? "Amount borrowed" : "Payment amount"}
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
          {isBorrow ? "What for" : "Note"}
        </span>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            isBorrow ? "Borrowed for brakes / cash" : "Cash payment"
          }
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
          <Calendar className="h-3.5 w-3.5" />
          Date
        </span>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </label>

      {notice && (
        <p
          className={`rounded-xl border px-3 py-2 text-sm ${
            noticeKind === "ok"
              ? "border-dash-green/35 bg-dash-green/10 text-dash-green"
              : "border-amber-400/35 bg-amber-950/40 text-amber-200"
          }`}
        >
          {notice}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className={isBorrow ? "bronze-button w-full" : "dash-button w-full"}
      >
        {busy
          ? isBorrow
            ? "Saving..."
            : "Logging and emailing Dad..."
          : isBorrow
            ? "Add to the note"
            : "Log payment"}
      </button>
    </form>
  );
}
