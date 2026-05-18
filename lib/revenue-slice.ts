export const FRIEND_LABOR_RATE = 15;

export interface RevenueSliceResult {
  gross: number;
  hours: number;
  friendLaborCut: number;
  netAfterLabor: number;
  savings: number;
  debtPayment: number;
  takeHome: number;
}

export function calculateRevenueSlice(
  gross: number,
  hours: number
): RevenueSliceResult {
  const friendLaborCut = Math.max(0, hours) * FRIEND_LABOR_RATE;
  const netAfterLabor = Math.max(0, gross - friendLaborCut);
  return {
    gross,
    hours,
    friendLaborCut,
    netAfterLabor,
    savings: netAfterLabor * 0.5,
    debtPayment: netAfterLabor * 0.3,
    takeHome: netAfterLabor * 0.2,
  };
}
