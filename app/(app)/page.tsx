"use client";

import { HeroSummaryCard } from "@/components/HeroSummaryCard";
import { useLedger } from "@/context/LedgerContext";

export default function DashboardPage() {
  const {
    totalRemaining,
    principal,
    totalBorrowed,
    percentPaid,
    milestone,
    targetDate,
  } = useLedger();

  return (
    <HeroSummaryCard
      totalRemaining={totalRemaining}
      principal={principal}
      totalBorrowed={totalBorrowed}
      percentPaid={percentPaid}
      nextMilestoneLabel={milestone.label}
      nextMilestoneAmount={milestone.amount}
      targetCompletionDate={targetDate}
    />
  );
}
