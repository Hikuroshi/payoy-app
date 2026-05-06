import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

export const createCashierSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export const updateCashierSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  id: z.uuid("Cashier tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  password: z
    .string()
    .refine((password) => password === "" || password.length >= 8, "Password minimal 8 karakter.")
    .optional(),
});

export const deleteCashierSchema = z.object({
  id: z.uuid("Cashier tidak valid."),
});

type CashierFormFields = "email" | "name" | "password";

export type CashierFormValues = {
  email: string;
  name: string;
};

export type CashierFormState = ActionFormState<
  CashierFormFields,
  CashierFormValues
>;

export const initialCashierFormState: CashierFormState = {};
