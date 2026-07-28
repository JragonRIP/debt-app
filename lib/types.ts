export type PaymentStatus = "verified" | "pending";

export type LedgerEntryKind = "income" | "debt_payment";

export interface Payment {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: PaymentStatus;
  /** income = job earnings (pace uses debtSharePercent slice); debt_payment = paid to Dad */
  kind?: LedgerEntryKind;
}

export interface LedgerSettings {
  totalDebt: number;
  milestoneStep: number;
  /** When true, new logs reduce debt; when false, track income only */
  repaymentActive: boolean;
  /** Percent of net job earnings earmarked for Dad (1–100) */
  debtSharePercent: number;
}

export const DEFAULT_SETTINGS: LedgerSettings = {
  totalDebt: 8500,
  milestoneStep: 500,
  repaymentActive: false,
  debtSharePercent: 30,
};

/** Clamp and normalize a debt-share percent to the allowed 1–100 range. */
export function normalizeDebtSharePercent(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_SETTINGS.debtSharePercent;
  return Math.min(100, Math.max(1, Math.round(n)));
}
