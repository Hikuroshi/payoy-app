import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/public-server";

import { MenuView, type PublicMenuFood } from "./menu-view";
import { TableDrawer } from "./table-drawer";

type MenuPageProps = {
  params: Promise<{ id: string }>;
};

type RestaurantTableRow = {
  id: string;
  number: string;
  owner_id: string;
};

type FoodRow = {
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

export default async function MenuPage({ params }: MenuPageProps) {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data: table, error: tableError } = await supabase
    .from("restaurant_tables")
    .select("id, number, owner_id")
    .eq("id", id)
    .maybeSingle<RestaurantTableRow>();

  if (tableError || !table) {
    notFound();
  }

  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id, name, description, image_path, price")
    .eq("owner_id", table.owner_id)
    .eq("is_available", true)
    .order("name", { ascending: true })
    .returns<FoodRow[]>();

  const menuFoods: PublicMenuFood[] = (foods ?? []).map((food) => ({
    id: food.id,
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
        tableId={table.id}
        tableNumber={table.number}
      />
      <TableDrawer tableNumber={table.number} />
    </main>
  );
}
