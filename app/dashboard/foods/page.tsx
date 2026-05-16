import Link from "next/link";
import { Suspense } from "react";

import { StatusToast } from "@/components/status-toast";
import { UrlSearchInput } from "@/components/url-search-input";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getParamValue, normalizeSearchQuery } from "@/lib/search";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { getOwnerFoods } from "./data";
import { FoodsList } from "./foods-list";

export const metadata = {
  title: "Menu",
};

type FoodsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FoodsPage({ searchParams }: FoodsPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { foods, error: foodsError } = await getOwnerFoods(owner.id, query);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? foodsError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Menu</CardTitle>
            <CardDescription>Kelola {foods.length} menu milik owner yang login beserta kategorinya.</CardDescription>
          </div>
          <CardAction>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/dashboard/categories">Kategori</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/foods/form">Tambah menu</Link>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari nama menu..." />
          </Suspense>
          <FoodsList foods={foods} />
        </CardContent>
      </Card>
    </div>
  );
}
