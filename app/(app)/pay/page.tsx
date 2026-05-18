"use client";

import { DollarSign } from "lucide-react";
import { LogPaymentForm } from "@/components/LogPaymentForm";
import { Card } from "@/components/ui/Card";
import { useLedger } from "@/context/LedgerContext";

export default function PayPage() {
  const { addPayment, paymentDraft, clearPaymentDraft, repaymentActive } =
    useLedger();

  return (
    <Card
      title={repaymentActive ? "Log a Payment" : "Log Income"}
      icon={<DollarSign className="h-4 w-4" />}
    >
      <LogPaymentForm
        onSubmit={addPayment}
        suggestedAmount={paymentDraft?.amount ?? null}
        suggestedDescription={paymentDraft?.description ?? null}
        onClearSuggestion={clearPaymentDraft}
        repaymentActive={repaymentActive}
      />
    </Card>
  );
}
