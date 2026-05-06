"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";
import {
  deleteTableSchema,
  tableSchema,
  type TableFormState,
  updateTableSchema,
} from "./schema";

const tablesPath = "/dashboard/tables";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWith(type: "success" | "error", message: string, path = tablesPath): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function createTableFormState(
  values: { number: string },
  message?: string,
  errors?: TableFormState["errors"]
): TableFormState {
  return {
    errors,
    message,
    submissionId: createSubmissionId(),
    values,
  };
}

export async function createRestaurantTable(
  _state: TableFormState,
  formData: FormData
): Promise<TableFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    number: getFormString(formData, "number"),
  };
  const parsed = tableSchema.safeParse({
    number: values.number,
  });

  if (!parsed.success) {
    return createTableFormState(
      values,
      "Periksa kembali data meja.",
      parsed.error.flatten().fieldErrors
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("restaurant_tables").insert({
    owner_id: owner.id,
    number: parsed.data.number,
  });

  if (error) {
    return createTableFormState(values, "Meja gagal dibuat.", {
      number:
        error.code === "23505" ? ["Nomor meja sudah digunakan."] : undefined,
    });
  }

  revalidatePath(tablesPath);
  redirectWith("success", "Meja berhasil dibuat.");
}

export async function updateRestaurantTable(
  _state: TableFormState,
  formData: FormData
): Promise<TableFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    number: getFormString(formData, "number"),
  };
  const parsed = updateTableSchema.safeParse({
    id: getFormString(formData, "id"),
    number: values.number,
  });

  if (!parsed.success) {
    return createTableFormState(
      values,
      "Periksa kembali data meja.",
      parsed.error.flatten().fieldErrors
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("restaurant_tables")
    .update({
      number: parsed.data.number,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    return createTableFormState(values, "Meja gagal diperbarui.", {
      number:
        error.code === "23505" ? ["Nomor meja sudah digunakan."] : undefined,
    });
  }

  revalidatePath(tablesPath);
  revalidatePath(`/table/${parsed.data.id}/menu`);
  redirectWith("success", "Meja berhasil diperbarui.");
}

export async function deleteRestaurantTable(formData: FormData) {
  const owner = await requireOwnerProfile();
  const parsed = deleteTableSchema.safeParse({
    id: getFormString(formData, "id"),
  });

  if (!parsed.success) {
    redirectWith("error", parsed.error.issues[0]?.message ?? "Meja tidak valid.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("restaurant_tables").delete().eq("id", parsed.data.id).eq("owner_id", owner.id);

  if (error) {
    redirectWith("error", "Meja gagal dihapus.");
  }

  revalidatePath(tablesPath);
  redirectWith("success", "Meja berhasil dihapus.");
}
