import type { Payment } from "./types";

export function sumPayments(payments: Payment[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
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
  payments: Payment[]
): Date | null {
  if (remainingBalance <= 0) return new Date();
  if (payments.length === 0) return null;

  const sorted = [...payments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const totalPaid = sumPayments(sorted);
  const first = new Date(sorted[0].date);
  const last = new Date(sorted[sorted.length - 1].date);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysElapsed = Math.max(1, (last.getTime() - first.getTime()) / msPerDay);

  const dailyRate = totalPaid / daysElapsed;
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
