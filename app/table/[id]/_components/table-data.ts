import "server-only";

import { createPublicClient } from "@/lib/public-server";

export type PublicTable = {
  id: string;
  number: string;
};

type PublicTableRow = {
  id: string;
  number: string;
};

export async function getPublicTable(id: string): Promise<PublicTable | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("restaurant_tables")
    .select("id, number")
    .eq("id", id)
    .maybeSingle<PublicTableRow>();

  if (error || !data) {
    return null;
  }

  return data;
}
