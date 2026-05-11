import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";
import { userRoles } from "@/lib/auth/types";

const userLimits = {
  email: 254,
  name: 100,
  password: 72,
} as const;

const emailField = z
  .string()
  .trim()
  .min(1, "Email wajib diisi.")
  .max(userLimits.email, `Email maksimal ${userLimits.email} karakter.`)
  .email("Email tidak valid.");

const nameField = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(userLimits.name, `Nama maksimal ${userLimits.name} karakter.`);

const passwordField = z
  .string()
  .min(8, "Password minimal 8 karakter.")
  .max(userLimits.password, `Password maksimal ${userLimits.password} karakter.`);

const optionalPasswordField = z
  .string()
  .max(userLimits.password, `Password maksimal ${userLimits.password} karakter.`)
  .refine(
    (password) => password === "" || password.length >= 8,
    "Password minimal 8 karakter."
  );

export const createUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: z.enum(userRoles),
});

export const updateUserSchema = z.object({
  id: z.uuid("User tidak valid."),
  name: nameField,
  email: emailField,
  password: optionalPasswordField.optional(),
  role: z.enum(userRoles),
});

export const deleteUserSchema = z.object({
  id: z.uuid("User tidak valid."),
});

type UserFormFields = "name" | "email" | "password" | "role";

export type UserFormValues = {
  email: string;
  name: string;
  role: (typeof userRoles)[number];
};

export type UserFormState = ActionFormState<UserFormFields, UserFormValues>;

export const initialUserFormState: UserFormState = {};
