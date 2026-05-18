import type { Payment } from "./types";
import { DEBT_SHARE } from "./revenue-slice";

export function getEntryKind(payment: Payment) {
  return payment.kind ?? "debt_payment";
}

/** Dollars that count toward Dad / debt pace (30% of income entries). */
export function debtContributionAmount(payment: Payment): number {
  const kind = getEntryKind(payment);
  if (kind === "income") return payment.amount * DEBT_SHARE;
  return payment.amount;
}

export function sumPayments(payments: Payment[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

export function sumDebtContributions(payments: Payment[]): number {
  return payments.reduce((sum, p) => sum + debtContributionAmount(p), 0);
}

export function getNextMilestone(
  totalPaid: number,
  totalDebt: number,
  step: number
): { label: string; amount: number; progress: number } {
  if (totalPaid >= totalDebt) {
    return { label: "Paid in full", amount: 0, progress: 100 };
  }
  const nextTarget = Math.min(
    totalDebt,
    Math.ceil((totalPaid + 1) / step) * step
  );
  const remaining = nextTarget - totalPaid;
  return {
    label: `$${nextTarget.toLocaleString()} mark`,
    amount: remaining,
    progress: (totalPaid / nextTarget) * 100,
  };
}

export function estimatePayoffDate(
  remainingBalance: number,
  pacePayments: Payment[]
): Date | null {
  if (remainingBalance <= 0) return new Date();
  if (pacePayments.length === 0) return null;

  const sorted = [...pacePayments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const paceTotal = sumDebtContributions(sorted);
  const first = new Date(sorted[0].date);
  const last = new Date(sorted[sorted.length - 1].date);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysElapsed = Math.max(1, (last.getTime() - first.getTime()) / msPerDay);

  const dailyRate = paceTotal / daysElapsed;
  if (dailyRate <= 0) return null;

  const daysRemaining = remainingBalance / dailyRate;
  const payoff = new Date();
  payoff.setDate(payoff.getDate() + Math.ceil(daysRemaining));
  return payoff;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Calendar days from today (midnight) until target (midnight). */
export function daysUntilDate(target: Date | string): number {
  const d = typeof target === "string" ? new Date(target) : new Date(target);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((d.getTime() - today.getTime()) / MS_PER_DAY));
}

/** e.g. "23 days", "4 months 7 days", "Paid off" */
export function formatDaysUntil(target: Date | string | null): string {
  if (!target) return "—";
  const d = typeof target === "string" ? new Date(target) : target;
  if (Number.isNaN(d.getTime())) return "—";

  const days = daysUntilDate(d);
  if (days === 0) return "Paid off";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;

  const months = Math.floor(days / 30);
  const remainder = days % 30;

  if (remainder === 0) {
    return months === 1 ? "1 month" : `${months} months`;
  }
  if (months === 0) {
    return `${days} days`;
  }

  const monthLabel = months === 1 ? "1 month" : `${months} months`;
  const dayLabel = remainder === 1 ? "1 day" : `${remainder} days`;
  return `${monthLabel} ${dayLabel}`;
}
