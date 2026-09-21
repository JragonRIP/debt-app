"use client";

import { DollarSign } from "lucide-react";
import { LogPaymentForm } from "@/components/LogPaymentForm";
import { Card } from "@/components/ui/Card";
import { useLedger } from "@/context/LedgerContext";

export default function PayPage() {
  const { addPayment, paymentDraft, clearPaymentDraft } = useLedger();

  return (
    <Card title="Pay or add debt" icon={<DollarSign className="h-4 w-4" />}>
      <p className="mb-4 text-sm text-white/50">
        Log a payment to knock the note down, or add debt if you borrow more.
      </p>
      <LogPaymentForm
        key={`${paymentDraft?.amount ?? ""}-${paymentDraft?.description ?? ""}-${paymentDraft?.kind ?? ""}`}
        onSubmit={addPayment}
        suggestedAmount={paymentDraft?.amount ?? null}
        suggestedDescription={paymentDraft?.description ?? null}
        suggestedKind={paymentDraft?.kind ?? null}
        onClearSuggestion={clearPaymentDraft}
      />
    </Card>
  );
}
