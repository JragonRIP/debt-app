"use client";

import { DollarSign } from "lucide-react";
import { LogPaymentForm } from "@/components/LogPaymentForm";
import { Card } from "@/components/ui/Card";
import { useLedger } from "@/context/LedgerContext";
import { DEBT_SHARE } from "@/lib/revenue-slice";

export default function PayPage() {
  const { addPayment, paymentDraft, clearPaymentDraft, repaymentActive } =
    useLedger();

  return (
    <Card
      title={repaymentActive ? "Log a Payment" : "Log Income"}
      icon={<DollarSign className="h-4 w-4" />}
    >
      {!repaymentActive && (
        <p className="-mt-2 mb-4 text-sm text-white/50">
          Job earnings are saved for projections. Only{" "}
          {Math.round(DEBT_SHARE * 100)}% counts toward your estimated payoff
          pace — nothing is deducted from your balance yet.
        </p>
      )}
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
