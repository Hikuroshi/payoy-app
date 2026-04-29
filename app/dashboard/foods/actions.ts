"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireOwnerProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";

const foodsPath = "/dashboard/foods";

const foodSchema = z.object({
  name: z.string().trim().min(2, "Nama makanan minimal 2 karakter."),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Harga tidak valid."),
  isAvailable: z.boolean(),
});

const updateFoodSchema = foodSchema.extend({
  id: z.uuid("Makanan tidak valid."),
});

const deleteFoodSchema = z.object({
  id: z.uuid("Makanan tidak valid."),
});

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFormBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function getSafeDashboardPath(path: string) {
  return path.startsWith(foodsPath) ? path : foodsPath;
}

function getRedirectPath(formData: FormData) {
  return getSafeDashboardPath(getFormString(formData, "redirectTo"));
}

function redirectWith(
  type: "success" | "error",
  message: string,
  path = foodsPath
): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

export async function createFood(formData: FormData) {
  const owner = await requireOwnerProfile();
  const errorPath = getRedirectPath(formData);
  const parsed = foodSchema.safeParse({
    name: getFormString(formData, "name"),
    description: getFormString(formData, "description"),
    price: getFormString(formData, "price"),
    isAvailable: getFormBoolean(formData, "is_available"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data makanan tidak valid.",
      errorPath
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("foods").insert({
    owner_id: owner.id,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: parsed.data.price,
    is_available: parsed.data.isAvailable,
  });

  if (error) {
    redirectWith("error", "Makanan gagal dibuat.", errorPath);
  }

  revalidatePath(foodsPath);
  redirectWith("success", "Makanan berhasil dibuat.");
}

export async function updateFood(formData: FormData) {
  const owner = await requireOwnerProfile();
  const errorPath = getRedirectPath(formData);
  const parsed = updateFoodSchema.safeParse({
    id: getFormString(formData, "id"),
    name: getFormString(formData, "name"),
    description: getFormString(formData, "description"),
    price: getFormString(formData, "price"),
    isAvailable: getFormBoolean(formData, "is_available"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data makanan tidak valid.",
      errorPath
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("foods")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      is_available: parsed.data.isAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    redirectWith("error", "Makanan gagal diperbarui.", errorPath);
  }

  revalidatePath(foodsPath);
  revalidatePath("/table/[id]/menu", "page");
  redirectWith("success", "Makanan berhasil diperbarui.");
}

export async function deleteFood(formData: FormData) {
  const owner = await requireOwnerProfile();
  const parsed = deleteFoodSchema.safeParse({
    id: getFormString(formData, "id"),
  });

  if (!parsed.success) {
    redirectWith("error", parsed.error.issues[0]?.message ?? "Makanan tidak valid.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("foods")
    .delete()
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    redirectWith("error", "Makanan gagal dihapus.");
  }

  revalidatePath(foodsPath);
  revalidatePath("/table/[id]/menu", "page");
  redirectWith("success", "Makanan berhasil dihapus.");
}
