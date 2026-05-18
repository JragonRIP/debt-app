"use client";

import { Calculator, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  calculateRevenueSlice,
  DEBT_SHARE,
  FRIEND_LABOR_RATE,
} from "@/lib/revenue-slice";
import { formatCurrency } from "@/lib/projections";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "./ui/Card";

const inputClass =
  "w-full rounded-xl border border-chrome/25 bg-forest-950/80 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-chrome/60 focus:ring-2 focus:ring-chrome/20";

export function RevenueSlicingCalculator() {
  const router = useRouter();
  const { setPaymentDraft, repaymentActive } = useLedger();
  const [earnings, setEarnings] = useState("");
  const [hours, setHours] = useState("");

  const slice = useMemo(() => {
    const gross = parseFloat(earnings) || 0;
    const h = parseFloat(hours) || 0;
    if (gross <= 0) return null;
    return calculateRevenueSlice(gross, h);
  }, [earnings, hours]);

  function handleApply() {
    if (!slice || slice.gross <= 0) return;
    if (repaymentActive) {
      setPaymentDraft({
        amount: Math.round(slice.debtPayment * 100) / 100,
        description: `Payment to Dad — ${hours || 0}h job (${formatCurrency(slice.gross)} gross)`,
      });
    } else {
      setPaymentDraft({
        amount: Math.round(slice.gross * 100) / 100,
        description: `Detailing job — ${hours || 0}h (${formatCurrency(slice.gross)} gross)`,
      });
    }
    router.push("/pay");
  }

  const rows = slice
    ? [
        {
          label: "Friend's Labor Cut",
          sub: `$${FRIEND_LABOR_RATE}/hr`,
          value: slice.friendLaborCut,
          accent: false,
        },
        { label: "Savings", sub: "50%", value: slice.savings, accent: false },
        {
          label: "Suggested Debt Payment",
          sub: repaymentActive
            ? `${Math.round(DEBT_SHARE * 100)}% — sent to Pay tab`
            : `${Math.round(DEBT_SHARE * 100)}% — used in payoff projection`,
          value: slice.debtPayment,
          accent: true,
        },
        {
          label: "Take-Home Profit",
          sub: "20%",
          value: slice.takeHome,
          accent: false,
        },
      ]
    : [];

  return (
    <Card title="Revenue Slicing" icon={<Calculator className="h-4 w-4" />}>
      <p className="-mt-2 mb-5 text-sm text-white/55">
        Split detailing job earnings after labor.{" "}
        {repaymentActive
          ? "Debt share opens on the Pay tab."
          : "Log gross income on Pay; projections count the 30% slice."}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-chrome/70">
            <DollarSign className="h-3.5 w-3.5" />
            Job Earnings
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={earnings}
            onChange={(e) => setEarnings(e.target.value)}
            placeholder="250.00"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-chrome/70">
            <Clock className="h-3.5 w-3.5" />
            Time (hours)
          </span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="4"
            className={inputClass}
          />
        </label>
      </div>

      {slice && (
        <div className="mt-6 space-y-3">
          <p className="text-xs uppercase tracking-wider text-chrome/60">
            Net after labor: {formatCurrency(slice.netAfterLabor)}
          </p>
          {rows.map((row) => (
            <div
              key={row.label}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                row.accent
                  ? "border-chrome/40 bg-chrome/10"
                  : "border-chrome/15 bg-forest-950/50"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-white">{row.label}</p>
                <p className="text-xs text-white/45">{row.sub}</p>
              </div>
              <p
                className={`font-display text-lg font-semibold ${
                  row.accent ? "text-chrome-bright" : "text-white/90"
                }`}
              >
                {formatCurrency(row.value)}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={handleApply}
            disabled={slice.gross <= 0}
            className="chrome-button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {repaymentActive
              ? "Apply Debt Payment — Go to Pay"
              : "Log Job Income — Go to Pay"}
          </button>
        </div>
      )}
    </Card>
  );
}
