"use client";

import { HeroSummaryCard } from "@/components/HeroSummaryCard";
import { useLedger } from "@/context/LedgerContext";

export default function DashboardPage() {
  const {
    totalRemaining,
    percentPaid,
    milestone,
    targetDate,
  } = useLedger();

  return (
    <HeroSummaryCard
      totalRemaining={totalRemaining}
      percentPaid={percentPaid}
      nextMilestoneLabel={milestone.label}
      nextMilestoneAmount={milestone.amount}
      targetCompletionDate={targetDate}
    />
  );
}
