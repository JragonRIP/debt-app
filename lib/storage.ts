import {
  DEFAULT_SETTINGS,
  normalizeDebtSharePercent,
  type LedgerSettings,
  type Payment,
} from "./types";

const PAYMENTS_KEY = "impala-ledger-payments-v2";
const SETTINGS_KEY = "impala-ledger-settings";

function normalizePayment(p: Payment): Payment {
  return {
    ...p,
    kind: p.kind ?? "debt_payment",
  };
}

function normalizeSettings(raw: Partial<LedgerSettings>): LedgerSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    debtSharePercent: normalizeDebtSharePercent(
      raw.debtSharePercent ?? DEFAULT_SETTINGS.debtSharePercent
    ),
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
    return normalizeSettings(JSON.parse(raw) as Partial<LedgerSettings>);
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
  localStorage.removeItem("impala-ledger-payments");
}
