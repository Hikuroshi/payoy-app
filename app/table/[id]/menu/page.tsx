import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/server";

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
  price: number | string;
};

export default async function MenuPage({ params }: MenuPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: table, error: tableError } = await supabase
    .from("restaurant_tables")
    .select("id, number, owner_id")
    .eq("id", id)
    .maybeSingle<RestaurantTableRow>();

  if (tableError || !table) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Meja tidak ditemukan</CardTitle>
            <CardDescription>Periksa kembali QR atau link meja.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id, name, description, price")
    .eq("owner_id", table.owner_id)
    .eq("is_available", true)
    .order("name", { ascending: true })
    .returns<FoodRow[]>();

  const menuFoods: PublicMenuFood[] = (foods ?? []).map((food) => ({
    id: food.id,
    name: food.name,
    description: food.description ?? "",
    price: Number(food.price),
  }));

  return (
    <main className="min-h-screen bg-background">
      <MenuView
        errorMessage={foodsError ? "Gagal memuat menu." : undefined}
        foods={menuFoods}
        tableNumber={table.number}
      />
      <TableDrawer tableNumber={table.number} />
    </main>
  );
}
