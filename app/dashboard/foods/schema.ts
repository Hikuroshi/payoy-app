import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

const foodLimits = {
  description: 500,
  name: 100,
  price: 999_999_999,
} as const;

const foodNameField = z
  .string()
  .trim()
  .min(2, "Nama makanan minimal 2 karakter.")
  .max(foodLimits.name, `Nama makanan maksimal ${foodLimits.name} karakter.`);

const foodDescriptionField = z
  .string()
  .trim()
  .max(
    foodLimits.description,
    `Deskripsi maksimal ${foodLimits.description} karakter.`
  )
  .optional();

const priceField = z
  .string()
  .trim()
  .min(1, "Harga wajib diisi.")
  .regex(/^\d+$/, "Harga harus berupa angka bulat.")
  .transform((value) => Number(value))
  .refine((value) => Number.isSafeInteger(value), "Harga tidak valid.")
  .refine((value) => value >= 0, "Harga tidak valid.")
  .refine(
    (value) => value <= foodLimits.price,
    "Harga maksimal Rp999.999.999."
  );

export const foodSchema = z.object({
  categoryId: z
    .union([
      z.literal(""),
      z.literal("__none"),
      z.uuid("Kategori tidak valid."),
    ])
    .transform((value) => (value === "" || value === "__none" ? null : value)),
  name: foodNameField,
  description: foodDescriptionField,
  price: priceField,
  isAvailable: z.boolean(),
});

export const updateFoodSchema = foodSchema.extend({
  id: z.uuid("Makanan tidak valid."),
});

export const deleteFoodSchema = z.object({
  id: z.uuid("Makanan tidak valid."),
});

type FoodFormFields =
  | "category_id"
  | "name"
  | "description"
  | "price"
  | "image"
  | "is_available";

export type FoodFormValues = {
  category_id: string;
  description: string;
  is_available: boolean;
  name: string;
  price: string;
};

export type FoodFormState = ActionFormState<FoodFormFields, FoodFormValues>;

export const initialFoodFormState: FoodFormState = {};
