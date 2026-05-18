"use client";

import { ChevronDown, History } from "lucide-react";
import { useState } from "react";
import type { Payment } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/projections";
import { Card } from "./ui/Card";

interface PaymentHistoryListProps {
  payments: Payment[];
}

function StatusBadge({ status }: { status: Payment["status"] }) {
  const verified = status === "verified";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        verified
          ? "border-emerald-400/40 bg-emerald-900/50 text-emerald-200"
          : "border-amber-400/35 bg-amber-950/40 text-amber-200"
      }`}
    >
      {verified ? "Verified by Dad" : "Pending"}
    </span>
  );
}

export function PaymentHistoryList({ payments }: PaymentHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card title="Payments" icon={<History className="h-4 w-4" />}>
      {sorted.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/50">
          No payments yet. Log one from the Pay tab.
        </p>
      ) : (
        <ul className="divide-y divide-chrome/15">
          {sorted.map((payment) => {
            const open = expandedId === payment.id;
            return (
              <li key={payment.id}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(open ? null : payment.id)
                  }
                  className="flex w-full items-center justify-between gap-3 py-3.5 text-left transition hover:bg-chrome/5"
                  aria-expanded={open}
                >
                  <span className="text-sm text-white/75">
                    {formatDate(payment.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-display text-base font-semibold text-chrome-bright">
                      {formatCurrency(payment.amount)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-chrome/50 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>
                {open && (
                  <div className="border-t border-chrome/10 bg-forest-950/50 px-1 pb-4 pt-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-chrome/55">
                      Description
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      {payment.description}
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-chrome/55">
                      Status
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
