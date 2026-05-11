import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

const accountLimits = {
  email: 254,
  name: 100,
  password: 72,
} as const;

const emailField = z
  .string()
  .trim()
  .min(1, "Email wajib diisi.")
  .max(accountLimits.email, `Email maksimal ${accountLimits.email} karakter.`)
  .email("Email tidak valid.");

const nameField = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(accountLimits.name, `Nama maksimal ${accountLimits.name} karakter.`);

const optionalPasswordField = z
  .string()
  .max(
    accountLimits.password,
    `Password maksimal ${accountLimits.password} karakter.`
  )
  .refine(
    (password) => password === "" || password.length >= 8,
    "Password minimal 8 karakter."
  );

const optionalConfirmPasswordField = z
  .string()
  .max(
    accountLimits.password,
    `Konfirmasi password maksimal ${accountLimits.password} karakter.`
  );

export const updateAccountSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: optionalPasswordField,
    confirmPassword: optionalConfirmPasswordField,
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Konfirmasi password tidak sama.",
      });
    }
  });

type AccountFormFields = "name" | "email" | "password" | "confirmPassword";

export type AccountFormValues = {
  email: string;
  name: string;
};

export type AccountFormState = ActionFormState<
  AccountFormFields,
  AccountFormValues
>;

export const initialAccountFormState: AccountFormState = {};
