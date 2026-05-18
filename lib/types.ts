export type PaymentStatus = "verified" | "pending";

export type LedgerEntryKind = "income" | "debt_payment";

export interface Payment {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: PaymentStatus;
  /** income = job earnings (pace uses 30% slice); debt_payment = paid to Dad */
  kind?: LedgerEntryKind;
}

export interface LedgerSettings {
  totalDebt: number;
  milestoneStep: number;
  /** When true, new logs reduce debt; when false, track income only */
  repaymentActive: boolean;
}

export const DEFAULT_SETTINGS: LedgerSettings = {
  totalDebt: 8500,
  milestoneStep: 500,
  repaymentActive: false,
};
