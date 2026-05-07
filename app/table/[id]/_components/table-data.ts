import "server-only";

import { createPublicClient } from "@/lib/public-server";
import { isUuid } from "@/lib/uuid";

export type PublicTable = {
  id: string;
  number: string;
};

export type PublicTableWithOwner = PublicTable & {
  ownerId: string;
};

type PublicTableRow = {
  id: string;
  number: string;
  owner_id: string;
};

export async function getPublicTable(id: string): Promise<PublicTable | null> {
  if (!isUuid(id)) {
    return null;
  }

  const table = await getPublicTableWithOwner(id);

  if (!table) {
    return null;
  }

  return {
    id: table.id,
    number: table.number,
  };
}

export async function getPublicTableWithOwner(
  id: string
): Promise<PublicTableWithOwner | null> {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("restaurant_tables")
    .select("id, number, owner_id")
    .eq("id", id)
    .maybeSingle<PublicTableRow>();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    number: data.number,
    ownerId: data.owner_id,
  };
}
