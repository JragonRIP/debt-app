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
import type { LedgerEntryKind, LedgerSettings, Payment } from "@/lib/types";
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
import type { PaymentDraft } from "@/components/LogPaymentForm";

export interface PaymentDraftPrefill {
  amount: number;
  description: string;
  kind?: LedgerEntryKind;
}

interface LedgerContextValue {
  hydrated: boolean;
  payments: Payment[];
  settings: LedgerSettings;
  paymentDraft: PaymentDraftPrefill | null;
  totalPaidTowardDebt: number;
  totalBorrowed: number;
  principal: number;
  totalRemaining: number;
  percentPaid: number;
  milestone: ReturnType<typeof getNextMilestone>;
  targetDate: Date | null;
  addPayment: (draft: PaymentDraft) => void;
  updateSettings: (settings: LedgerSettings) => void;
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

  const startingNote = settings?.totalDebt ?? 0;

  const debtPayments = useMemo(
    () => payments.filter((p) => (p.kind ?? "debt_payment") === "debt_payment"),
    [payments]
  );
  const borrowEntries = useMemo(
    () => payments.filter((p) => p.kind === "borrow"),
    [payments]
  );

  const totalPaidTowardDebt = useMemo(
    () => sumPayments(debtPayments),
    [debtPayments]
  );
  const totalBorrowed = useMemo(
    () => sumPayments(borrowEntries),
    [borrowEntries]
  );

  const principal = startingNote + totalBorrowed;
  const totalRemaining = Math.max(0, principal - totalPaidTowardDebt);
  const percentPaid =
    principal > 0 ? (totalPaidTowardDebt / principal) * 100 : 0;

  const milestone = useMemo(
    () =>
      getNextMilestone(
        totalPaidTowardDebt,
        principal,
        settings?.milestoneStep ?? 500
      ),
    [totalPaidTowardDebt, principal, settings?.milestoneStep]
  );

  const targetDate = useMemo(
    () => estimatePayoffDate(totalRemaining, debtPayments),
    [totalRemaining, debtPayments]
  );

  const addPayment = useCallback((draft: PaymentDraft) => {
    const amount = parseFloat(draft.amount);
    if (!amount || amount <= 0) return;
    const kind: LedgerEntryKind = draft.kind ?? "debt_payment";
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
  }, []);

  const updateSettings = useCallback((next: LedgerSettings) => {
    setSettings(next);
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
      <div className="flex min-h-dvh items-center justify-center font-digital text-dash-green/70">
        IGNITION...
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
        totalPaidTowardDebt,
        totalBorrowed,
        principal,
        totalRemaining,
        percentPaid,
        milestone,
        targetDate,
        addPayment,
        updateSettings,
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
