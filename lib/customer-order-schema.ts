import { z } from "zod";

import { paymentMethods } from "@/lib/order";

export const orderItemSchema = z.object({
  id: z.uuid("Makanan tidak valid."),
  note: z.string().max(200, "Catatan maksimal 200 karakter.").optional(),
  quantity: z.number().int().min(1).max(99),
});

export const createCustomerOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Pesanan minimal 1 item."),
  paymentMethod: z.enum(paymentMethods),
  tableId: z.uuid("Meja tidak valid."),
});

export const markCustomerOrderPaidSchema = z.object({
  id: z.uuid("Pesanan tidak valid."),
});

export const customerOrderStatusRequestSchema = z.object({
  id: z.uuid("Pesanan tidak valid."),
  tableId: z.uuid("Meja tidak valid."),
});
