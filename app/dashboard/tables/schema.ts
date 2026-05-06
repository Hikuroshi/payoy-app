import { z } from "zod";

import type { ActionFormState } from "@/lib/action-form";

export const tableSchema = z.object({
  number: z.string().trim().min(1, "Nomor meja wajib diisi."),
});

export const updateTableSchema = tableSchema.extend({
  id: z.uuid("Meja tidak valid."),
});

export const deleteTableSchema = z.object({
  id: z.uuid("Meja tidak valid."),
});

export type TableFormState = ActionFormState<"number", { number: string }>;

export const initialTableFormState: TableFormState = {};
