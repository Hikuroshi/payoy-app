import { notFound } from "next/navigation";
import { isUuid } from "@/lib/uuid";
import { getParamValue, normalizeSearchQuery, toSupabaseLikePattern } from "@/lib/search";
import { createPublicClient } from "@/lib/public-server";

import { MenuView, type PublicMenuCategory, type PublicMenuFood } from "./menu-view";
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
  category_id: string | null;
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  price: number | string;
};

type CategoryFoodRow = {
  category: { name: string } | null;
  category_id: string | null;
  image_path: string | null;
  name: string;
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
  const requestedCategoryId = getParamValue(resolvedSearchParams, "category");
  const demoReturnTo = getDemoReturnTo(resolvedSearchParams);
  const table = await getPublicTableWithOwner(id);

  if (!table) {
    notFound();
  }

  const supabase = createPublicClient();
  const normalizedCategoryId = requestedCategoryId && isUuid(requestedCategoryId)
    ? requestedCategoryId
    : undefined;

  const { data: categoryFoods } = await supabase
    .from("foods")
    .select("category_id, image_path, name, category:food_categories!foods_category_id_fkey(name)")
    .eq("owner_id", table.ownerId)
    .eq("is_available", true)
    .not("category_id", "is", null)
    .order("name", { ascending: true })
    .returns<CategoryFoodRow[]>();

  const categoryMap = new Map<string, PublicMenuCategory>();

  for (const food of categoryFoods ?? []) {
    if (!food.category_id || !food.category?.name || categoryMap.has(food.category_id)) {
      continue;
    }

    categoryMap.set(food.category_id, {
      id: food.category_id,
      imageUrl: getMenuImageUrl(supabase, food.image_path),
      name: food.category.name,
    });
  }

  const categories = Array.from(categoryMap.values()).sort((left, right) => left.name.localeCompare(right.name, "id-ID"));
  const selectedCategory = normalizedCategoryId
    ? categories.find((category) => category.id === normalizedCategoryId)
    : undefined;
  const activeCategory = query ? undefined : selectedCategory;

  let foodsRequest = supabase
    .from("foods")
    .select("id, name, description, image_path, price, category_id, category:food_categories!foods_category_id_fkey(name)")
    .eq("owner_id", table.ownerId)
    .eq("is_available", true)
    .order("name", { ascending: true });

  if (selectedCategory && !query) {
    foodsRequest = foodsRequest.eq("category_id", selectedCategory.id);
  }

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
        categories={categories}
        errorMessage={foodsError ? "Gagal memuat menu." : undefined}
        foods={menuFoods}
        query={query}
        selectedCategoryId={activeCategory?.id}
        selectedCategoryName={activeCategory?.name}
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
