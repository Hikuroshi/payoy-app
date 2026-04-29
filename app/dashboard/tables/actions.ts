"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireOwnerProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";

const tablesPath = "/dashboard/tables";

const tableSchema = z.object({
  number: z.string().trim().min(1, "Nomor meja wajib diisi."),
});

const updateTableSchema = tableSchema.extend({
  id: z.uuid("Meja tidak valid."),
});

const deleteTableSchema = z.object({
  id: z.uuid("Meja tidak valid."),
});

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getSafeDashboardPath(path: string) {
  return path.startsWith(tablesPath) ? path : tablesPath;
}

function getRedirectPath(formData: FormData) {
  return getSafeDashboardPath(getFormString(formData, "redirectTo"));
}

function redirectWith(
  type: "success" | "error",
  message: string,
  path = tablesPath
): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function getTableErrorMessage(code?: string) {
  return code === "23505" ? "Nomor meja sudah digunakan." : "Meja gagal diproses.";
}

export async function createRestaurantTable(formData: FormData) {
  const owner = await requireOwnerProfile();
  const errorPath = getRedirectPath(formData);
  const parsed = tableSchema.safeParse({
    number: getFormString(formData, "number"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data meja tidak valid.",
      errorPath
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("restaurant_tables").insert({
    owner_id: owner.id,
    number: parsed.data.number,
  });

  if (error) {
    redirectWith("error", getTableErrorMessage(error.code), errorPath);
  }

  revalidatePath(tablesPath);
  redirectWith("success", "Meja berhasil dibuat.");
}

export async function updateRestaurantTable(formData: FormData) {
  const owner = await requireOwnerProfile();
  const errorPath = getRedirectPath(formData);
  const parsed = updateTableSchema.safeParse({
    id: getFormString(formData, "id"),
    number: getFormString(formData, "number"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data meja tidak valid.",
      errorPath
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
    redirectWith("error", getTableErrorMessage(error.code), errorPath);
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
  const { error } = await supabase
    .from("restaurant_tables")
    .delete()
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    redirectWith("error", "Meja gagal dihapus.");
  }

  revalidatePath(tablesPath);
  redirectWith("success", "Meja berhasil dihapus.");
}
