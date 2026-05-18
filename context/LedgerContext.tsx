"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LedgerSettings, Payment } from "@/lib/types";
import {
  estimatePayoffDate,
  getNextMilestone,
  sumPayments,
} from "@/lib/projections";
import {
  clearPaymentsStorage,
  loadPayments,
  loadSettings,
  savePayments,
  saveSettings,
} from "@/lib/storage";

const FRESH_START_KEY = "impala-ledger-fresh-start-v3";
import type { PaymentDraft } from "@/components/LogPaymentForm";

export interface PaymentDraftPrefill {
  amount: number;
  description: string;
}

interface LedgerContextValue {
  hydrated: boolean;
  payments: Payment[];
  settings: LedgerSettings;
  paymentDraft: PaymentDraftPrefill | null;
  totalPaid: number;
  totalRemaining: number;
  percentPaid: number;
  milestone: ReturnType<typeof getNextMilestone>;
  targetDate: Date | null;
  addPayment: (draft: PaymentDraft) => void;
  updateSettings: (settings: LedgerSettings) => void;
  setPaymentDraft: (draft: PaymentDraftPrefill | null) => void;
  clearPaymentDraft: () => void;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<LedgerSettings | null>(null);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraftPrefill | null>(
    null
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(FRESH_START_KEY)) {
      clearPaymentsStorage();
      localStorage.setItem(FRESH_START_KEY, "1");
    }
    setPayments(loadPayments());
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) savePayments(payments);
  }, [payments, hydrated]);

  useEffect(() => {
    if (hydrated && settings) saveSettings(settings);
  }, [settings, hydrated]);

  const totalPaid = useMemo(() => sumPayments(payments), [payments]);
  const totalDebt = settings?.totalDebt ?? 0;
  const totalRemaining = Math.max(0, totalDebt - totalPaid);
  const percentPaid = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

  const milestone = useMemo(
    () =>
      getNextMilestone(
        totalPaid,
        totalDebt,
        settings?.milestoneStep ?? 500
      ),
    [totalPaid, totalDebt, settings?.milestoneStep]
  );

  const targetDate = useMemo(
    () => estimatePayoffDate(totalRemaining, payments),
    [totalRemaining, payments]
  );

  const addPayment = useCallback((draft: PaymentDraft) => {
    const amount = parseFloat(draft.amount);
    if (!amount || amount <= 0) return;
    const payment: Payment = {
      id: crypto.randomUUID(),
      amount,
      description: draft.description,
      date: draft.date,
      status: "pending",
    };
    setPayments((prev) => [...prev, payment]);
    setPaymentDraft(null);
  }, []);

  const updateSettings = useCallback((next: LedgerSettings) => {
    setSettings(next);
  }, []);

  const clearPaymentDraft = useCallback(() => {
    setPaymentDraft(null);
  }, []);

  if (!hydrated || !settings) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-chrome/60">
        Loading ledger…
      </div>
    );
  }

  return (
    <LedgerContext.Provider
      value={{
        hydrated,
        payments,
        settings,
        paymentDraft,
        totalPaid,
        totalRemaining,
        percentPaid,
        milestone,
        targetDate,
        addPayment,
        updateSettings,
        setPaymentDraft,
        clearPaymentDraft,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) {
    throw new Error("useLedger must be used within LedgerProvider");
  }
  return ctx;
}
