import "server-only";

import { createClient } from "@/lib/server";

export type RestaurantTable = {
  id: string;
  number: string;
  createdAt: string;
};

type RestaurantTableRow = {
  id: string;
  number: string;
  created_at: string;
};

export async function getOwnerTables(ownerId: string): Promise<{
  error?: string;
  tables: RestaurantTable[];
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurant_tables")
    .select("id, number, created_at")
    .eq("owner_id", ownerId)
    .order("number", { ascending: true })
    .returns<RestaurantTableRow[]>();

  if (error) {
    return { tables: [], error: "Meja gagal dimuat." };
  }

  return {
    tables: (data ?? []).map((table) => ({
      id: table.id,
      number: table.number,
      createdAt: table.created_at,
    })),
  };
}

export async function getOwnerTable(
  ownerId: string,
  id: string
): Promise<{
  error?: string;
  table?: RestaurantTable;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurant_tables")
    .select("id, number, created_at")
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle<RestaurantTableRow>();

  if (error) {
    return { error: "Meja gagal dimuat." };
  }

  if (!data) {
    return { error: "Meja tidak ditemukan." };
  }

  return {
    table: {
      id: data.id,
      number: data.number,
      createdAt: data.created_at,
    },
  };
}
