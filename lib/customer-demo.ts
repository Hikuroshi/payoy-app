import "server-only";

import { createPublicClient } from "@/lib/public-server";

type DemoTableRow = {
  id: string;
};

export async function getDemoCustomerHref(
  ownerId?: string,
  fallback = "/dashboard",
  returnTo = fallback
) {
  const supabase = createPublicClient();
  let query = supabase
    .from("restaurant_tables")
    .select("id")
    .order("created_at", { ascending: true });

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  const { data, error } = await query.limit(1).maybeSingle<DemoTableRow>();

  if (error || !data) {
    return fallback;
  }

  const params = new URLSearchParams({
    demo: "1",
    returnTo,
  });

  return `/table/${data.id}/menu?${params.toString()}`;
}
