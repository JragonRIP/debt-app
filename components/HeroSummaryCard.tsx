"use client";

import { Calendar, Flag, TrendingUp } from "lucide-react";
import { ImpalaProgressBar } from "./ImpalaProgressBar";
import { formatCurrency, formatDate } from "@/lib/projections";

interface HeroSummaryCardProps {
  totalRemaining: number;
  percentPaid: number;
  nextMilestoneLabel: string;
  nextMilestoneAmount: number;
  targetCompletionDate: Date | null;
}

export function HeroSummaryCard({
  totalRemaining,
  percentPaid,
  nextMilestoneLabel,
  nextMilestoneAmount,
  targetCompletionDate,
}: HeroSummaryCardProps) {
  return (
    <section className="impala-hero relative overflow-hidden rounded-3xl border border-chrome/30 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-chrome/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-emerald-800/20 blur-3xl" />

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-chrome/80">
        1968 Impala · Buy-Back Ledger
      </p>
      <p className="text-sm text-white/60">Total Remaining Balance</p>
      <p className="font-display mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {formatCurrency(totalRemaining)}
      </p>

      <ImpalaProgressBar percent={percentPaid} />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-chrome/20 bg-forest-950/60 px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-chrome/70">
            <Flag className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Next Milestone
            </span>
          </div>
          <p className="font-medium text-white">{nextMilestoneLabel}</p>
          {nextMilestoneAmount > 0 && (
            <p className="mt-0.5 text-sm text-chrome-bright">
              {formatCurrency(nextMilestoneAmount)} to go
            </p>
          )}
        </div>
        <div className="rounded-xl border border-chrome/20 bg-forest-950/60 px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-chrome/70">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Target Completion
            </span>
          </div>
          <p className="font-medium text-white">
            {formatDate(targetCompletionDate)}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/50">
            <TrendingUp className="h-3 w-3 text-chrome/60" />
            Based on your payment pace
          </p>
        </div>
      </div>
    </section>
  );
}
