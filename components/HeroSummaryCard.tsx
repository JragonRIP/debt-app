"use client";

import { Calendar, Flag, TrendingUp } from "lucide-react";
import { MarquisProgressBar } from "./MarquisProgressBar";
import { formatCurrency, formatDate, formatDaysUntil } from "@/lib/projections";

interface HeroSummaryCardProps {
  totalRemaining: number;
  principal: number;
  totalBorrowed: number;
  percentPaid: number;
  nextMilestoneLabel: string;
  nextMilestoneAmount: number;
  targetCompletionDate: Date | null;
}

export function HeroSummaryCard({
  totalRemaining,
  principal,
  totalBorrowed,
  percentPaid,
  nextMilestoneLabel,
  nextMilestoneAmount,
  targetCompletionDate,
}: HeroSummaryCardProps) {
  return (
    <section className="marquis-hero relative overflow-hidden rounded-3xl border border-bronze/35 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-dash-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-bronze/15 blur-3xl" />

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-bronze-bright/85">
        1999 Grand Marquis · Note
      </p>

      <p className="text-sm text-white/55">Balance remaining</p>
      <p className="font-digital mt-1 text-4xl font-medium tracking-widest text-dash-green drop-shadow-[0_0_18px_rgba(57,255,120,0.45)] sm:text-5xl">
        {formatCurrency(totalRemaining)}
      </p>
      <p className="mt-1 font-digital text-xs tracking-wider text-dash-green/55">
        PRINCIPAL {formatCurrency(principal)}
        {totalBorrowed > 0 ? `  ·  ADDED ${formatCurrency(totalBorrowed)}` : ""}
      </p>

      <MarquisProgressBar percent={percentPaid} />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-bronze/25 bg-dash-950/70 px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-bronze-bright/70">
            <Flag className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Next Milestone
            </span>
          </div>
          <p className="font-medium text-white">{nextMilestoneLabel}</p>
          {nextMilestoneAmount > 0 && (
            <p className="mt-0.5 font-digital text-sm tracking-wide text-dash-green">
              {formatCurrency(nextMilestoneAmount)} to go
            </p>
          )}
        </div>
        <div className="rounded-xl border border-bronze/25 bg-dash-950/70 px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-bronze-bright/70">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Target Completion
            </span>
          </div>
          <p className="font-medium text-white">
            {formatDate(targetCompletionDate)}
          </p>
          <p className="mt-1 text-sm text-dash-green/80">
            <span className="text-white/45">Days until · </span>
            {formatDaysUntil(targetCompletionDate)}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/45">
            <TrendingUp className="h-3 w-3 text-bronze/70" />
            Based on payments logged
          </p>
        </div>
      </div>
    </section>
  );
}
