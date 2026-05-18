"use client";

import { DollarSign, Calendar } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export interface PaymentDraft {
  amount: string;
  description: string;
  date: string;
}

interface LogPaymentFormProps {
  onSubmit: (draft: PaymentDraft) => void;
  suggestedAmount?: number | null;
  suggestedDescription?: string | null;
  onClearSuggestion?: () => void;
  repaymentActive?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-chrome/25 bg-forest-950/80 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-chrome/60 focus:ring-2 focus:ring-chrome/20";

export function LogPaymentForm({
  onSubmit,
  suggestedAmount,
  suggestedDescription,
  onClearSuggestion,
  repaymentActive = true,
}: LogPaymentFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);

  useEffect(() => {
    if (suggestedAmount != null && suggestedAmount > 0) {
      setAmount(suggestedAmount.toFixed(2));
    }
  }, [suggestedAmount]);

  useEffect(() => {
    if (suggestedDescription) {
      setDescription(suggestedDescription);
    }
  }, [suggestedDescription]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount || !description.trim()) return;
    onSubmit({ amount, description: description.trim(), date });
    onClearSuggestion?.();
    setAmount("");
    setDescription("");
    setDate(today);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-chrome/70">
          <DollarSign className="h-3.5 w-3.5" />
          {repaymentActive ? "Payment amount" : "Job earnings (gross)"}
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={repaymentActive ? "0.00" : "250.00"}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-chrome/70">
          Source / Description
        </span>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Monday detailing profit"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-chrome/70">
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

      <button type="submit" className="chrome-button w-full">
        {repaymentActive ? "Submit Payment" : "Log Income"}
      </button>
    </form>
  );
}
