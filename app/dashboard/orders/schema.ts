import { z } from "zod";

import { orderStatuses } from "@/lib/order";

const redirectLimits = {
  path: 200,
} as const;

const dashboardRedirectField = z
  .string()
  .trim()
  .min(1, "Redirect tidak valid.")
  .max(redirectLimits.path, "Redirect tidak valid.")
  .startsWith("/dashboard/orders", "Redirect tidak valid.");

export const updateOrderStatusSchema = z.object({
  id: z.uuid("Pesanan tidak valid."),
  redirectTo: dashboardRedirectField,
  status: z.enum(orderStatuses),
});
