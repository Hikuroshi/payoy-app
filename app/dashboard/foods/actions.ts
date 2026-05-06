"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";
import {
  deleteFoodSchema,
  foodSchema,
  type FoodFormState,
  type FoodFormValues,
  updateFoodSchema,
} from "./schema";

const foodsPath = "/dashboard/foods";
const menuImageBucket = "menu_image";
const maxImageSize = 1024 * 1024;

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFormBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function getImageFile(formData: FormData) {
  const value = formData.get("image");

  if (!(value instanceof File) || value.size === 0) {
    return { file: null };
  }

  if (!value.type.startsWith("image/")) {
    return { error: "File harus berupa gambar.", file: null };
  }

  if (value.size > maxImageSize) {
    return { error: "Ukuran gambar maksimal 1 MB.", file: null };
  }

  return { file: value };
}

function getImageExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  return file.type.split("/")[1]?.split("+")[0] || "jpg";
}

async function uploadFoodImage(supabase: Awaited<ReturnType<typeof createClient>>, ownerId: string, foodId: string, file: File) {
  const extension = getImageExtension(file);
  const path = `${ownerId}/${foodId}-${randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(menuImageBucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  return { error, path };
}

function redirectWith(type: "success" | "error", message: string, path = foodsPath): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function createFoodFormState(
  values: FoodFormValues,
  message?: string,
  errors?: FoodFormState["errors"]
): FoodFormState {
  return {
    errors,
    message,
    submissionId: createSubmissionId(),
    values,
  };
}

function mapFoodFieldErrors(
  errors: Record<string, string[] | undefined>
): FoodFormState["errors"] {
  return {
    description: errors.description,
    is_available: errors.isAvailable,
    name: errors.name,
    price: errors.price,
  };
}

export async function createFood(
  _state: FoodFormState,
  formData: FormData
): Promise<FoodFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    description: getFormString(formData, "description"),
    is_available: getFormBoolean(formData, "is_available"),
    name: getFormString(formData, "name"),
    price: getFormString(formData, "price"),
  };
  const image = getImageFile(formData);
  const parsed = foodSchema.safeParse({
    name: values.name,
    description: values.description,
    price: values.price,
    isAvailable: values.is_available,
  });

  if (!parsed.success) {
    return createFoodFormState(
      values,
      "Periksa kembali data makanan.",
      mapFoodFieldErrors(parsed.error.flatten().fieldErrors)
    );
  }

  if (image.error) {
    return createFoodFormState(values, "Periksa kembali data makanan.", {
      image: [image.error],
    });
  }

  const supabase = await createClient();
  const foodId = randomUUID();
  let imagePath: string | null = null;

  if (image.file) {
    const uploadedImage = await uploadFoodImage(supabase, owner.id, foodId, image.file);

    if (uploadedImage.error) {
      return createFoodFormState(values, "Gambar makanan gagal diupload.", {
        image: ["Gambar makanan gagal diupload."],
      });
    }

    imagePath = uploadedImage.path;
  }

  const { error } = await supabase.from("foods").insert({
    id: foodId,
    owner_id: owner.id,
    name: parsed.data.name,
    description: parsed.data.description || null,
    image_path: imagePath,
    price: parsed.data.price,
    is_available: parsed.data.isAvailable,
  });

  if (error) {
    if (imagePath) {
      await supabase.storage.from(menuImageBucket).remove([imagePath]);
    }

    return createFoodFormState(values, "Makanan gagal dibuat.");
  }

  revalidatePath(foodsPath);
  redirectWith("success", "Makanan berhasil dibuat.");
}

export async function updateFood(
  _state: FoodFormState,
  formData: FormData
): Promise<FoodFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    description: getFormString(formData, "description"),
    is_available: getFormBoolean(formData, "is_available"),
    name: getFormString(formData, "name"),
    price: getFormString(formData, "price"),
  };
  const image = getImageFile(formData);
  const parsed = updateFoodSchema.safeParse({
    id: getFormString(formData, "id"),
    name: values.name,
    description: values.description,
    price: values.price,
    isAvailable: values.is_available,
  });

  if (!parsed.success) {
    return createFoodFormState(
      values,
      "Periksa kembali data makanan.",
      mapFoodFieldErrors(parsed.error.flatten().fieldErrors)
    );
  }

  if (image.error) {
    return createFoodFormState(values, "Periksa kembali data makanan.", {
      image: [image.error],
    });
  }

  const supabase = await createClient();
  let imagePath: string | undefined;
  let previousImagePath: string | null = null;

  if (image.file) {
    const { data: currentFood } = await supabase.from("foods").select("image_path").eq("id", parsed.data.id).eq("owner_id", owner.id).maybeSingle<{ image_path: string | null }>();

    previousImagePath = currentFood?.image_path ?? null;

    const uploadedImage = await uploadFoodImage(supabase, owner.id, parsed.data.id, image.file);

    if (uploadedImage.error) {
      return createFoodFormState(values, "Gambar makanan gagal diupload.", {
        image: ["Gambar makanan gagal diupload."],
      });
    }

    imagePath = uploadedImage.path;
  }

  const { error } = await supabase
    .from("foods")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      ...(imagePath ? { image_path: imagePath } : {}),
      price: parsed.data.price,
      is_available: parsed.data.isAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("owner_id", owner.id);

  if (error) {
    if (imagePath) {
      await supabase.storage.from(menuImageBucket).remove([imagePath]);
    }

    return createFoodFormState(values, "Makanan gagal diperbarui.");
  }

  if (imagePath && previousImagePath) {
    await supabase.storage.from(menuImageBucket).remove([previousImagePath]);
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
  const { data: food } = await supabase.from("foods").select("image_path").eq("id", parsed.data.id).eq("owner_id", owner.id).maybeSingle<{ image_path: string | null }>();

  const { error } = await supabase.from("foods").delete().eq("id", parsed.data.id).eq("owner_id", owner.id);

  if (error) {
    redirectWith("error", "Makanan gagal dihapus.");
  }

  if (food?.image_path) {
    await supabase.storage.from(menuImageBucket).remove([food.image_path]);
  }

  revalidatePath(foodsPath);
  revalidatePath("/table/[id]/menu", "page");
  redirectWith("success", "Makanan berhasil dihapus.");
}
