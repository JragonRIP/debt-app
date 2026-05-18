"use client";

import { PaymentHistoryList } from "@/components/PaymentHistoryList";
import { useLedger } from "@/context/LedgerContext";

export default function HistoryPage() {
  const { payments, repaymentActive } = useLedger();
  return (
    <PaymentHistoryList
      payments={payments}
      repaymentActive={repaymentActive}
    />
  );
}
