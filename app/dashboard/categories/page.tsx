import Link from "next/link";
import { Suspense } from "react";

import { StatusToast } from "@/components/status-toast";
import { UrlSearchInput } from "@/components/url-search-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { getParamValue, normalizeSearchQuery } from "@/lib/search";

import { CategoriesList } from "./categories-list";
import { getOwnerCategories } from "./data";

export const metadata = {
  title: "Kategori",
};

type CategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { categories, error: categoriesError } = await getOwnerCategories(
    owner.id,
    query
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? categoriesError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Kategori</CardTitle>
            <CardDescription>
              Kelola {categories.length} kategori untuk mengelompokkan makanan.
            </CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/categories/form">Tambah kategori</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari nama kategori..." />
          </Suspense>
          <CategoriesList categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
