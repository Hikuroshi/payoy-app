import { z } from "zod";

import { paymentMethods } from "@/lib/order";

const orderLimits = {
  note: 200,
  quantity: 99,
} as const;

const noteField = z
  .string()
  .trim()
  .max(orderLimits.note, `Catatan maksimal ${orderLimits.note} karakter.`)
  .optional();

const orderQuantityField = z
  .number()
  .int("Jumlah item tidak valid.")
  .min(1, "Jumlah item minimal 1.")
  .max(orderLimits.quantity, `Jumlah item maksimal ${orderLimits.quantity}.`);

export const orderItemSchema = z.object({
  id: z.uuid("Makanan tidak valid."),
  note: noteField,
  quantity: orderQuantityField,
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
