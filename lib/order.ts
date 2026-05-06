export const paymentMethods = ["QRIS", "E-Wallet"] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export const activeOrderStatuses = [
  "waiting_payment",
  "paid",
  "processing",
] as const;
export const historyOrderStatuses = ["done", "cancelled"] as const;
export const revenueOrderStatuses = ["paid", "processing", "done"] as const;
export const orderStatuses = [
  ...activeOrderStatuses,
  ...historyOrderStatuses,
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return orderStatuses.includes(value as OrderStatus);
}
