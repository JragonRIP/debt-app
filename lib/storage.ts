import { DEFAULT_SETTINGS, type LedgerSettings, type Payment } from "./types";

const PAYMENTS_KEY = "marquis-ledger-payments-v1";
const SETTINGS_KEY = "marquis-ledger-settings-v1";

function normalizePayment(p: Payment): Payment {
  return {
    ...p,
    kind: p.kind ?? "debt_payment",
  };
}

export function loadPayments(): Payment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Payment[]).map(normalizePayment);
  } catch {
    return [];
  }
}

export function savePayments(payments: Payment[]): void {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
}

export function loadSettings(): LedgerSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<LedgerSettings>;
    return {
      totalDebt: parsed.totalDebt ?? DEFAULT_SETTINGS.totalDebt,
      milestoneStep: parsed.milestoneStep ?? DEFAULT_SETTINGS.milestoneStep,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: LedgerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/** Wipes stored payments (fresh start). */
export function clearPaymentsStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PAYMENTS_KEY);
}
