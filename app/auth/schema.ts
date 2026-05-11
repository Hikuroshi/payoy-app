import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

const authLimits = {
  email: 254,
  name: 100,
  password: 72,
} as const;

const emailField = z
  .string()
  .trim()
  .min(1, "Email wajib diisi.")
  .max(authLimits.email, `Email maksimal ${authLimits.email} karakter.`)
  .email("Masukkan email yang valid.");

const nameField = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(authLimits.name, `Nama maksimal ${authLimits.name} karakter.`);

const loginPasswordField = z
  .string()
  .min(1, "Password wajib diisi.")
  .max(128, "Password terlalu panjang.");

const passwordField = z
  .string()
  .min(8, "Password minimal 8 karakter.")
  .max(authLimits.password, `Password maksimal ${authLimits.password} karakter.`);

const confirmPasswordField = z
  .string()
  .min(1, "Konfirmasi password wajib diisi.")
  .max(
    authLimits.password,
    `Konfirmasi password maksimal ${authLimits.password} karakter.`
  );

export const loginSchema = z.object({
  email: emailField,
  password: loginPasswordField,
});

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });

type AuthFormFields = "name" | "email" | "password" | "confirmPassword";

type AuthFormValues = {
  email: string;
  name: string;
};

export type AuthFormState = ActionFormState<AuthFormFields, AuthFormValues> & {
  success?: boolean;
};

export const initialAuthFormState: AuthFormState = {};
