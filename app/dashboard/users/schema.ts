import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";
import { userRoles } from "@/lib/auth/types";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  role: z.enum(userRoles),
});

export const updateUserSchema = z.object({
  id: z.uuid("User tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Email tidak valid."),
  password: z
    .string()
    .refine((password) => password === "" || password.length >= 8, "Password minimal 8 karakter.")
    .optional(),
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
