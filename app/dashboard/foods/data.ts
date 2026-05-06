import "server-only";

import { toSupabaseLikePattern } from "@/lib/search";
import { createClient } from "@/lib/server";

const menuImageBucket = "menu_image";

export type Food = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  imageUrl: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
};

type FoodRow = {
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  price: number | string;
  is_available: boolean;
  created_at: string;
};

function getPublicImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string | null
) {
  if (!path) {
    return "";
  }

  return supabase.storage.from(menuImageBucket).getPublicUrl(path).data
    .publicUrl;
}

export async function getOwnerFoods(
  ownerId: string,
  query?: string
): Promise<{
  error?: string;
  foods: Food[];
}> {
  const supabase = await createClient();
  let request = supabase
    .from("foods")
    .select("id, name, description, image_path, price, is_available, created_at")
    .eq("owner_id", ownerId)
    .order("name", { ascending: true });

  if (query) {
    request = request.ilike("name", toSupabaseLikePattern(query));
  }

  const { data, error } = await request.returns<FoodRow[]>();

  if (error) {
    return { foods: [], error: "Makanan gagal dimuat." };
  }

  return {
    foods: (data ?? []).map((food) => ({
      id: food.id,
      name: food.name,
      description: food.description ?? "",
      imagePath: food.image_path ?? "",
      imageUrl: getPublicImageUrl(supabase, food.image_path),
      price: Number(food.price),
      isAvailable: food.is_available,
      createdAt: food.created_at,
    })),
  };
}

export async function getOwnerFood(
  ownerId: string,
  id: string
): Promise<{
  error?: string;
  food?: Food;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("foods")
    .select("id, name, description, image_path, price, is_available, created_at")
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle<FoodRow>();

  if (error) {
    return { error: "Makanan gagal dimuat." };
  }

  if (!data) {
    return { error: "Makanan tidak ditemukan." };
  }

  return {
    food: {
      id: data.id,
      name: data.name,
      description: data.description ?? "",
      imagePath: data.image_path ?? "",
      imageUrl: getPublicImageUrl(supabase, data.image_path),
      price: Number(data.price),
      isAvailable: data.is_available,
      createdAt: data.created_at,
    },
  };
}
