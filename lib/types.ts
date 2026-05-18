export type PaymentStatus = "verified" | "pending";

export interface Payment {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: PaymentStatus;
}

export interface LedgerSettings {
  totalDebt: number;
  milestoneStep: number;
}

export const DEFAULT_SETTINGS: LedgerSettings = {
  totalDebt: 8500,
  milestoneStep: 500,
};
