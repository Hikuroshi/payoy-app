import { z } from "zod";

import { orderStatuses } from "@/lib/order";

export const updateOrderStatusSchema = z.object({
  id: z.uuid("Pesanan tidak valid."),
  redirectTo: z.string(),
  status: z.enum(orderStatuses),
});
