"use client";

import { PaymentHistoryList } from "@/components/PaymentHistoryList";
import { useLedger } from "@/context/LedgerContext";

export default function HistoryPage() {
  const { payments } = useLedger();
  return <PaymentHistoryList payments={payments} />;
}
