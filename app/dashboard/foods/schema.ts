import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

export const foodSchema = z.object({
  name: z.string().trim().min(2, "Nama makanan minimal 2 karakter."),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Harga tidak valid."),
  isAvailable: z.boolean(),
});

export const updateFoodSchema = foodSchema.extend({
  id: z.uuid("Makanan tidak valid."),
});

export const deleteFoodSchema = z.object({
  id: z.uuid("Makanan tidak valid."),
});

type FoodFormFields =
  | "name"
  | "description"
  | "price"
  | "image"
  | "is_available";

export type FoodFormValues = {
  description: string;
  is_available: boolean;
  name: string;
  price: string;
};

export type FoodFormState = ActionFormState<FoodFormFields, FoodFormValues>;

export const initialFoodFormState: FoodFormState = {};
