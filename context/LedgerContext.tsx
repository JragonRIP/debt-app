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
  type LedgerEntryKind,
  type LedgerSettings,
  type Payment,
} from "@/lib/types";
import {
  estimatePayoffDate,
  formatDate,
  getNextMilestone,
  sumPayments,
} from "@/lib/projections";
import {
  sendDadPaymentEmail,
  type PaymentNotifyPayload,
} from "@/lib/payment-notify";
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
  debtSharePercent: number;
  milestone: ReturnType<typeof getNextMilestone>;
  targetDate: Date | null;
  addPayment: (draft: PaymentDraft) => Promise<{ emailed: boolean; emailError?: string }>;
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
  const debtSharePercent = settings?.debtSharePercent ?? 30;

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
    () => estimatePayoffDate(totalRemaining, debtPayments, debtSharePercent),
    [totalRemaining, debtPayments, debtSharePercent]
  );

  const addPayment = useCallback(
    async (draft: PaymentDraft) => {
      const amount = parseFloat(draft.amount);
      if (!amount || amount <= 0) {
        return { emailed: false, emailError: "Enter a payment amount" };
      }
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

      if (kind !== "debt_payment") {
        return { emailed: false };
      }

      const nextPaid = totalPaidTowardDebt + amount;
      const nextRemaining = Math.max(0, principal - nextPaid);
      const nextDebtPayments = [...debtPayments, payment];
      const expected = estimatePayoffDate(
        nextRemaining,
        nextDebtPayments,
        debtSharePercent
      );
      const payload: PaymentNotifyPayload = {
        amount,
        remaining: nextRemaining,
        expectedPayoff: expected ? formatDate(expected) : null,
        description: draft.description,
        date: draft.date,
      };

      try {
        await sendDadPaymentEmail(payload);
        return { emailed: true };
      } catch (error) {
        return {
          emailed: false,
          emailError:
            error instanceof Error ? error.message : "Could not email Dad",
        };
      }
    },
    [debtPayments, debtSharePercent, principal, totalPaidTowardDebt]
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
        debtSharePercent,
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
