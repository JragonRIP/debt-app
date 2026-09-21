"use client";

import { Calculator, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  calculateRevenueSlice,
  FRIEND_LABOR_RATE,
} from "@/lib/revenue-slice";
import { formatCurrency } from "@/lib/projections";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "./ui/Card";

const inputClass =
  "w-full rounded-xl border border-bronze/30 bg-dash-950/80 px-4 py-3 font-digital text-lg tracking-wide text-dash-green placeholder:text-dash-green/30 outline-none transition focus:border-dash-green/50 focus:ring-2 focus:ring-dash-green/20";

export function RevenueSlicingCalculator() {
  const router = useRouter();
  const { setPaymentDraft, debtSharePercent, setDebtSharePercent } =
    useLedger();
  const [earnings, setEarnings] = useState("");
  const [hours, setHours] = useState("");

  const slice = useMemo(() => {
    const gross = parseFloat(earnings) || 0;
    const h = parseFloat(hours) || 0;
    if (gross <= 0) return null;
    return calculateRevenueSlice(gross, h, debtSharePercent);
  }, [earnings, hours, debtSharePercent]);

  function handleApply() {
    if (!slice || slice.gross <= 0) return;
    setPaymentDraft({
      amount: Math.round(slice.debtPayment * 100) / 100,
      description: `Payment — ${hours || 0}h job (${formatCurrency(slice.gross)} gross)`,
      kind: "debt_payment",
    });
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
        {
          label: "Savings",
          sub: `${slice.savingsPercent}%`,
          value: slice.savings,
          accent: false,
        },
        {
          label: "Suggested Debt Payment",
          sub: `${debtSharePercent}% — sent to Pay tab`,
          value: slice.debtPayment,
          accent: true,
        },
        {
          label: "Take-Home Profit",
          sub: `${slice.takeHomePercent}%`,
          value: slice.takeHome,
          accent: false,
        },
      ]
    : [];

  return (
    <Card title="Revenue Slicing" icon={<Calculator className="h-4 w-4" />}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
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
          <span className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
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

      <div className="mt-5 rounded-xl border border-bronze/25 bg-dash-950/50 px-4 py-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-bronze-bright/70">
              Percent to the note
            </p>
            <p className="mt-0.5 text-xs text-white/45">
              Drag to experiment with your debt share
            </p>
          </div>
          <p className="font-digital text-2xl font-semibold text-dash-green tabular-nums">
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
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={debtSharePercent}
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-white/40">
          <span>1%</span>
          <span>100%</span>
        </div>
      </div>

      {slice && (
        <div className="mt-6 space-y-3">
          <p className="font-digital text-xs uppercase tracking-wider text-dash-green/70">
            Net after labor: {formatCurrency(slice.netAfterLabor)}
          </p>
          {rows.map((row) => (
            <div
              key={row.label}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                row.accent
                  ? "border-dash-green/40 bg-dash-green/10"
                  : "border-bronze/20 bg-dash-950/50"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-white">{row.label}</p>
                <p className="text-xs text-white/45">{row.sub}</p>
              </div>
              <p
                className={`font-digital text-lg font-semibold tracking-wide ${
                  row.accent ? "text-dash-green" : "text-bronze-bright"
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
            className="dash-button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply Debt Payment — Go to Pay
          </button>
        </div>
      )}
    </Card>
  );
}
