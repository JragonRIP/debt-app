"use client";

import { HeroSummaryCard } from "@/components/HeroSummaryCard";
import { useLedger } from "@/context/LedgerContext";

export default function DashboardPage() {
  const {
    repaymentActive,
    totalRemaining,
    settings,
    percentPaid,
    milestone,
    targetDate,
  } = useLedger();

  return (
    <HeroSummaryCard
      repaymentActive={repaymentActive}
      totalRemaining={totalRemaining}
      totalDebt={settings.totalDebt}
      percentPaid={percentPaid}
      nextMilestoneLabel={milestone.label}
      nextMilestoneAmount={milestone.amount}
      targetCompletionDate={targetDate}
    />
  );
}
