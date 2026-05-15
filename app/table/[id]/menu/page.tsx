import { notFound } from "next/navigation";
import { getParamValue, normalizeSearchQuery, toSupabaseLikePattern } from "@/lib/search";
import { createPublicClient } from "@/lib/public-server";

import { MenuView, type PublicMenuFood } from "./menu-view";
import { TableDrawer } from "./table-drawer";
import { getPublicTableWithOwner } from "../_components/table-data";

export const metadata = {
  title: "Menu Meja",
};

type MenuPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type FoodRow = {
  category: { name: string } | null;
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  price: number | string;
};

function getMenuImageUrl(
  supabase: ReturnType<typeof createPublicClient>,
  path: string | null
) {
  if (!path) {
    return "";
  }

  return supabase.storage.from("menu_image").getPublicUrl(path).data.publicUrl;
}

function getDemoReturnTo(searchParams: Record<string, string | string[] | undefined>) {
  const demo = getParamValue(searchParams, "demo");
  const returnTo = getParamValue(searchParams, "returnTo");

  if (demo !== "1" || !returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return undefined;
  }

  return returnTo;
}

export default async function MenuPage({ params, searchParams }: MenuPageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const demoReturnTo = getDemoReturnTo(resolvedSearchParams);
  const table = await getPublicTableWithOwner(id);

  if (!table) {
    notFound();
  }

  const supabase = createPublicClient();

  let foodsRequest = supabase
    .from("foods")
    .select("id, name, description, image_path, price, category:food_categories!foods_category_id_fkey(name)")
    .eq("owner_id", table.ownerId)
    .eq("is_available", true)
    .order("name", { ascending: true });

  if (query) {
    foodsRequest = foodsRequest.ilike("name", toSupabaseLikePattern(query));
  }

  const { data: foods, error: foodsError } = await foodsRequest.returns<FoodRow[]>();

  const menuFoods: PublicMenuFood[] = (foods ?? []).map((food) => ({
    id: food.id,
    categoryName: food.category?.name ?? "",
    name: food.name,
    description: food.description ?? "",
    imageUrl: getMenuImageUrl(supabase, food.image_path),
    price: Number(food.price),
  }));

  return (
    <main className="min-h-screen bg-background">
      <MenuView
        errorMessage={foodsError ? "Gagal memuat menu." : undefined}
        foods={menuFoods}
        query={query}
        tableId={table.id}
        tableNumber={table.number}
      />
      <TableDrawer
        closeHref={demoReturnTo}
        showCloseButton={Boolean(demoReturnTo)}
        tableNumber={table.number}
      />
    </main>
  );
}
