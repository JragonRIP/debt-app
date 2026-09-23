export const DAD_NOTIFY_EMAIL = "aidanjoseph@gmail.com";

export interface PaymentNotifyPayload {
  amount: number;
  remaining: number;
  expectedPayoff: string | null;
  description: string;
  date: string;
}

export function formatNotifyMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function buildFormSubmitBody(
  payload: PaymentNotifyPayload,
  pageUrl?: string
) {
  const remaining = formatNotifyMoney(payload.remaining);
  const logged = formatNotifyMoney(payload.amount);
  const payoff =
    payload.expectedPayoff ??
    "Not enough payment history yet to estimate a payoff date";

  const message = [
    "A payment was just logged on the Grand Marquis note.",
    "",
    `Amount logged: ${logged}`,
    `Balance remaining: ${remaining}`,
    `Expected payoff date: ${payoff}`,
    `Payment date: ${payload.date}`,
    `Note: ${payload.description}`,
  ].join("\n");

  return {
    _subject: `Grand Marquis payment logged: ${logged}`,
    _template: "box",
    _captcha: "false",
    ...(pageUrl ? { _url: pageUrl } : {}),
    name: "Marquis Ledger",
    email: DAD_NOTIFY_EMAIL,
    amount_logged: logged,
    remaining_balance: remaining,
    expected_payoff_date: payoff,
    payment_date: payload.date,
    note: payload.description,
    message,
  };
}

export async function sendDadPaymentEmail(payload: PaymentNotifyPayload) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(DAD_NOTIFY_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(
        buildFormSubmitBody(
          payload,
          typeof window !== "undefined" ? window.location.href : undefined
        )
      ),
    }
  );

  const result = (await response.json()) as {
    success?: string | boolean;
    message?: string;
  };
  const success = result.success === true || result.success === "true";
  if (!response.ok || !success) {
    const raw = result.message || "FormSubmit could not send the email";
    if (/activation/i.test(raw)) {
      throw new Error(
        "FormSubmit emailed Dad an activation link first. After he clicks it, future payments will notify him automatically."
      );
    }
    throw new Error(raw);
  }
}
