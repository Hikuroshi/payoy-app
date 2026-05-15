"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";

import {
  categorySchema,
  deleteCategorySchema,
  type CategoryFormState,
  updateCategorySchema,
} from "./schema";

const categoriesPath = "/dashboard/categories";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWith(
  type: "success" | "error",
  message: string,
  path = categoriesPath
): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function createCategoryFormState(
  values: { name: string },
  message?: string,
  errors?: CategoryFormState["errors"]
): CategoryFormState {
  return {
    errors,
    message,
    submissionId: createSubmissionId(),
    values,
  };
}

export async function createCategory(
  _state: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    name: getFormString(formData, "name"),
  };
  const parsed = categorySchema.safeParse({
    name: values.name,
  });

  if (!parsed.success) {
    return createCategoryFormState(
      values,
      "Periksa kembali data kategori.",
      parsed.error.flatten().fieldErrors
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("food_categories").insert({
    owner_id: owner.id,
    name: parsed.data.name,
  });

  if (error) {
    return createCategoryFormState(values, "Kategori gagal dibuat.", {
      name:
        error.code === "23505" ? ["Nama kategori sudah digunakan."] : undefined,
    });
  }

  revalidatePath(categoriesPath);
  revalidatePath("/dashboard/foods");
  revalidatePath("/table/[id]/menu", "page");
  redirectWith("success", "Kategori berhasil dibuat.");
}

export async function updateCategory(
  _state: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    name: getFormString(formData, "name"),
  };
  const parsed = updateCategorySchema.safeParse({
    id: getFormString(formData, "id"),
    name: values.name,
  });

  if (!parsed.success) {
    return createCategoryFormState(
      values,
      "Periksa kembali data kategori.",
      parsed.error.flatten().fieldErrors
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("food_categories")
    .update({
      name: parsed.data.name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    return createCategoryFormState(values, "Kategori gagal diperbarui.", {
      name:
        error.code === "23505" ? ["Nama kategori sudah digunakan."] : undefined,
    });
  }

  revalidatePath(categoriesPath);
  revalidatePath("/dashboard/foods");
  revalidatePath("/table/[id]/menu", "page");
  redirectWith("success", "Kategori berhasil diperbarui.");
}

export async function deleteCategory(formData: FormData) {
  const owner = await requireOwnerProfile();
  const parsed = deleteCategorySchema.safeParse({
    id: getFormString(formData, "id"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Kategori tidak valid."
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("food_categories")
    .delete()
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    redirectWith("error", "Kategori gagal dihapus.");
  }

  revalidatePath(categoriesPath);
  revalidatePath("/dashboard/foods");
  revalidatePath("/table/[id]/menu", "page");
  redirectWith("success", "Kategori berhasil dihapus.");
}
