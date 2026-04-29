import "server-only";

import { createClient } from "@/lib/server";

export type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
};

type FoodRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  is_available: boolean;
  created_at: string;
};

export async function getOwnerFoods(ownerId: string): Promise<{
  error?: string;
  foods: Food[];
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("foods")
    .select("id, name, description, price, is_available, created_at")
    .eq("owner_id", ownerId)
    .order("name", { ascending: true })
    .returns<FoodRow[]>();

  if (error) {
    return { foods: [], error: "Makanan gagal dimuat." };
  }

  return {
    foods: (data ?? []).map((food) => ({
      id: food.id,
      name: food.name,
      description: food.description ?? "",
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
    .select("id, name, description, price, is_available, created_at")
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
      price: Number(data.price),
      isAvailable: data.is_available,
      createdAt: data.created_at,
    },
  };
}
