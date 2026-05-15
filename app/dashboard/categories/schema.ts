import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

const categoryLimits = {
  name: 60,
} as const;

const categoryNameField = z
  .string()
  .trim()
  .min(2, "Nama kategori minimal 2 karakter.")
  .max(
    categoryLimits.name,
    `Nama kategori maksimal ${categoryLimits.name} karakter.`
  );

export const categorySchema = z.object({
  name: categoryNameField,
});

export const updateCategorySchema = categorySchema.extend({
  id: z.uuid("Kategori tidak valid."),
});

export const deleteCategorySchema = z.object({
  id: z.uuid("Kategori tidak valid."),
});

export type CategoryFormState = ActionFormState<"name", { name: string }>;

export const initialCategoryFormState: CategoryFormState = {};
