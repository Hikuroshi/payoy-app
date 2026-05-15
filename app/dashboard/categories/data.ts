import "server-only";

import { toSupabaseLikePattern } from "@/lib/search";
import { createClient } from "@/lib/server";

export type FoodCategory = {
  id: string;
  name: string;
  createdAt: string;
};

export type FoodCategoryOption = {
  id: string;
  name: string;
};

type FoodCategoryRow = {
  id: string;
  name: string;
  created_at: string;
};

export async function getOwnerCategories(
  ownerId: string,
  query?: string
): Promise<{
  categories: FoodCategory[];
  error?: string;
}> {
  const supabase = await createClient();
  let request = supabase
    .from("food_categories")
    .select("id, name, created_at")
    .eq("owner_id", ownerId)
    .order("name", { ascending: true });

  if (query) {
    request = request.ilike("name", toSupabaseLikePattern(query));
  }

  const { data, error } = await request.returns<FoodCategoryRow[]>();

  if (error) {
    return { categories: [], error: "Kategori gagal dimuat." };
  }

  return {
    categories: (data ?? []).map((category) => ({
      createdAt: category.created_at,
      id: category.id,
      name: category.name,
    })),
  };
}

export async function getOwnerCategory(
  ownerId: string,
  id: string
): Promise<{
  category?: FoodCategory;
  error?: string;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_categories")
    .select("id, name, created_at")
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle<FoodCategoryRow>();

  if (error) {
    return { error: "Kategori gagal dimuat." };
  }

  if (!data) {
    return { error: "Kategori tidak ditemukan." };
  }

  return {
    category: {
      createdAt: data.created_at,
      id: data.id,
      name: data.name,
    },
  };
}

export async function getOwnerCategoryOptions(
  ownerId: string
): Promise<FoodCategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("food_categories")
    .select("id, name")
    .eq("owner_id", ownerId)
    .order("name", { ascending: true })
    .returns<FoodCategoryOption[]>();

  return data ?? [];
}
