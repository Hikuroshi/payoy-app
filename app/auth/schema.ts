import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

export const loginSchema = z.object({
  email: z.string().trim().email("Masukkan email yang valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter."),
    email: z.string().trim().email("Masukkan email yang valid."),
    password: z.string().min(8, "Password minimal 8 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
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
