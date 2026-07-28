import {
  DEFAULT_SETTINGS,
  normalizeDebtSharePercent,
} from "./types";

export const FRIEND_LABOR_RATE = 15;

/** Default share of net job earnings earmarked for Dad / buy-back debt */
export const DEBT_SHARE = DEFAULT_SETTINGS.debtSharePercent / 100;

export interface RevenueSliceResult {
  gross: number;
  hours: number;
  friendLaborCut: number;
  netAfterLabor: number;
  savings: number;
  debtPayment: number;
  takeHome: number;
  debtSharePercent: number;
  savingsPercent: number;
  takeHomePercent: number;
}

/**
 * Split net earnings after friend labor.
 * Debt share is configurable; remaining is split 5:2 savings:take-home
 * (same ratio as the original 50% / 20% when debt is 30%).
 */
export function calculateRevenueSlice(
  gross: number,
  hours: number,
  debtSharePercent: number = DEFAULT_SETTINGS.debtSharePercent
): RevenueSliceResult {
  const percent = normalizeDebtSharePercent(debtSharePercent);
  const debtShare = percent / 100;
  const remaining = 1 - debtShare;
  const savingsShare = remaining * (5 / 7);
  const takeHomeShare = remaining * (2 / 7);

  const friendLaborCut = Math.max(0, hours) * FRIEND_LABOR_RATE;
  const netAfterLabor = Math.max(0, gross - friendLaborCut);
  return {
    gross,
    hours,
    friendLaborCut,
    netAfterLabor,
    savings: netAfterLabor * savingsShare,
    debtPayment: netAfterLabor * debtShare,
    takeHome: netAfterLabor * takeHomeShare,
    debtSharePercent: percent,
    savingsPercent: Math.round(savingsShare * 1000) / 10,
    takeHomePercent: Math.round(takeHomeShare * 1000) / 10,
  };
}
