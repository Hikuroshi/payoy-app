import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/server";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: table, error: tableError } = await supabase.from("restaurant_tables").select("id, number, owner_id").eq("id", id).maybeSingle<RestaurantTableRow>();

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

  const { data: foods, error: foodsError } = await supabase.from("foods").select("id, name, description, price").eq("owner_id", table.owner_id).eq("is_available", true).order("name", { ascending: true }).returns<FoodRow[]>();

  return (
    <main className="min-h-svh bg-background">
      <TableDrawer tableNumber={table.number} />
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">Menu Makanan</h1>
          </div>
          <p className="text-xs/relaxed text-foreground">Meja #{table.number}</p>
        </div>

        {foodsError ? (
          <Card>
            <CardHeader>
              <CardTitle>Menu gagal dimuat</CardTitle>
              <CardDescription>Coba buka kembali halaman ini.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {!foodsError && !foods?.length ? (
          <Card>
            <CardHeader>
              <CardTitle>Menu belum tersedia</CardTitle>
              <CardDescription>Belum ada makanan yang bisa dipesan.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <div className="grid gap-3">
          {(foods ?? []).map((food) => (
            <Card key={food.id} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle>{food.name}</CardTitle>
                    {food.description ? <CardDescription>{food.description}</CardDescription> : null}
                  </div>
                  <div className="shrink-0 text-xs/relaxed font-medium">{formatCurrency(Number(food.price))}</div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
