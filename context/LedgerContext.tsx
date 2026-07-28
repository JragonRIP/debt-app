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
import {
  normalizeDebtSharePercent,
  type LedgerSettings,
  type Payment,
} from "@/lib/types";
import {
  estimatePayoffDate,
  getNextMilestone,
  sumDebtContributions,
  sumPayments,
} from "@/lib/projections";
import {
  clearPaymentsStorage,
  loadPayments,
  loadSettings,
  savePayments,
  saveSettings,
} from "@/lib/storage";
import type { PaymentDraft } from "@/components/LogPaymentForm";

const FRESH_START_KEY = "impala-ledger-fresh-start-v3";

export interface PaymentDraftPrefill {
  amount: number;
  description: string;
}

interface LedgerContextValue {
  hydrated: boolean;
  payments: Payment[];
  settings: LedgerSettings;
  paymentDraft: PaymentDraftPrefill | null;
  repaymentActive: boolean;
  debtSharePercent: number;
  totalPaidTowardDebt: number;
  totalIncomeLogged: number;
  effectiveTowardGoal: number;
  totalRemaining: number;
  percentPaid: number;
  milestone: ReturnType<typeof getNextMilestone>;
  targetDate: Date | null;
  addPayment: (draft: PaymentDraft) => void;
  updateSettings: (settings: LedgerSettings) => void;
  setDebtSharePercent: (percent: number) => void;
  setPaymentDraft: (draft: PaymentDraftPrefill | null) => void;
  clearPaymentDraft: () => void;
  clearAllPayments: () => void;
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

  const repaymentActive = settings?.repaymentActive ?? false;
  const totalDebt = settings?.totalDebt ?? 0;
  const debtSharePercent = settings?.debtSharePercent ?? 30;

  const debtPayments = useMemo(
    () => payments.filter((p) => p.kind === "debt_payment"),
    [payments]
  );
  const incomeEntries = useMemo(
    () => payments.filter((p) => p.kind === "income"),
    [payments]
  );

  const totalPaidTowardDebt = useMemo(
    () => sumPayments(debtPayments),
    [debtPayments]
  );
  const totalIncomeLogged = useMemo(
    () => sumPayments(incomeEntries),
    [incomeEntries]
  );

  const totalRemaining = Math.max(0, totalDebt - totalPaidTowardDebt);
  const percentPaid =
    totalDebt > 0 ? (totalPaidTowardDebt / totalDebt) * 100 : 0;

  const effectiveTowardGoal = useMemo(() => {
    if (repaymentActive) return totalPaidTowardDebt;
    return sumDebtContributions(incomeEntries, debtSharePercent);
  }, [repaymentActive, totalPaidTowardDebt, incomeEntries, debtSharePercent]);

  const milestone = useMemo(() => {
    if (!repaymentActive) {
      return { label: "—", amount: 0, progress: 0 };
    }
    return getNextMilestone(
      totalPaidTowardDebt,
      totalDebt,
      settings?.milestoneStep ?? 500
    );
  }, [repaymentActive, totalPaidTowardDebt, totalDebt, settings?.milestoneStep]);

  const targetDate = useMemo(() => {
    if (repaymentActive) {
      return estimatePayoffDate(totalRemaining, debtPayments, debtSharePercent);
    }
    return estimatePayoffDate(totalDebt, incomeEntries, debtSharePercent);
  }, [
    repaymentActive,
    totalRemaining,
    totalDebt,
    debtPayments,
    incomeEntries,
    debtSharePercent,
  ]);

  const addPayment = useCallback(
    (draft: PaymentDraft) => {
      const amount = parseFloat(draft.amount);
      if (!amount || amount <= 0) return;
      const kind = repaymentActive ? "debt_payment" : "income";
      const payment: Payment = {
        id: crypto.randomUUID(),
        amount,
        description: draft.description,
        date: draft.date,
        status: "pending",
        kind,
      };
      setPayments((prev) => [...prev, payment]);
      setPaymentDraft(null);
    },
    [repaymentActive]
  );

  const updateSettings = useCallback((next: LedgerSettings) => {
    setSettings({
      ...next,
      debtSharePercent: normalizeDebtSharePercent(next.debtSharePercent),
    });
  }, []);

  const setDebtSharePercent = useCallback((percent: number) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            debtSharePercent: normalizeDebtSharePercent(percent),
          }
        : prev
    );
  }, []);

  const clearPaymentDraft = useCallback(() => {
    setPaymentDraft(null);
  }, []);

  const clearAllPayments = useCallback(() => {
    clearPaymentsStorage();
    setPayments([]);
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
        repaymentActive,
        debtSharePercent,
        totalPaidTowardDebt,
        totalIncomeLogged,
        effectiveTowardGoal,
        totalRemaining,
        percentPaid,
        milestone,
        targetDate,
        addPayment,
        updateSettings,
        setDebtSharePercent,
        setPaymentDraft,
        clearPaymentDraft,
        clearAllPayments,
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
