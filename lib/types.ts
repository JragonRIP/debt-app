export type PaymentStatus = "verified" | "pending";

export type LedgerEntryKind = "income" | "debt_payment" | "borrow";

export interface Payment {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: PaymentStatus;
  /** income = job earnings; debt_payment = paid down; borrow = added to the note */
  kind?: LedgerEntryKind;
}

export interface LedgerSettings {
  totalDebt: number;
  milestoneStep: number;
  /** Percent of net job earnings earmarked for debt (1–100) */
  debtSharePercent: number;
}

export const DEFAULT_SETTINGS: LedgerSettings = {
  totalDebt: 8500,
  milestoneStep: 500,
  debtSharePercent: 30,
};

/** Clamp and normalize a debt-share percent to the allowed 1–100 range. */
export function normalizeDebtSharePercent(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_SETTINGS.debtSharePercent;
  return Math.min(100, Math.max(1, Math.round(n)));
}
