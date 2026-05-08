import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

export const updateAccountSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter."),
    email: z.string().trim().email("Email tidak valid."),
    password: z
      .string()
      .refine(
        (password) => password === "" || password.length >= 8,
        "Password minimal 8 karakter."
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
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
