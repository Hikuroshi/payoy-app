import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

const tableLimits = {
  number: 10,
} as const;

const tableNumberField = z
  .string()
  .trim()
  .min(1, "Nomor meja wajib diisi.")
  .max(
    tableLimits.number,
    `Nomor meja maksimal ${tableLimits.number} karakter.`
  );

export const tableSchema = z.object({
  number: tableNumberField,
});

export const updateTableSchema = tableSchema.extend({
  id: z.uuid("Meja tidak valid."),
});

export const deleteTableSchema = z.object({
  id: z.uuid("Meja tidak valid."),
});

export type TableFormState = ActionFormState<"number", { number: string }>;

export const initialTableFormState: TableFormState = {};
