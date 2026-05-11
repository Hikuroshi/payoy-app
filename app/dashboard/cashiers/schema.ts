import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

const cashierLimits = {
  email: 254,
  name: 100,
  password: 72,
} as const;

const emailField = z
  .string()
  .trim()
  .min(1, "Email wajib diisi.")
  .max(cashierLimits.email, `Email maksimal ${cashierLimits.email} karakter.`)
  .email("Email tidak valid.");

const nameField = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(cashierLimits.name, `Nama maksimal ${cashierLimits.name} karakter.`);

const passwordField = z
  .string()
  .min(8, "Password minimal 8 karakter.")
  .max(
    cashierLimits.password,
    `Password maksimal ${cashierLimits.password} karakter.`
  );

const optionalPasswordField = z
  .string()
  .max(
    cashierLimits.password,
    `Password maksimal ${cashierLimits.password} karakter.`
  )
  .refine(
    (password) => password === "" || password.length >= 8,
    "Password minimal 8 karakter."
  );

export const createCashierSchema = z.object({
  email: emailField,
  name: nameField,
  password: passwordField,
});

export const updateCashierSchema = z.object({
  email: emailField,
  id: z.uuid("Cashier tidak valid."),
  name: nameField,
  password: optionalPasswordField.optional(),
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
