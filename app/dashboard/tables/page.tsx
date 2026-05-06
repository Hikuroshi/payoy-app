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
import { getParamValue, normalizeSearchQuery } from "@/lib/search";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { getOwnerTables } from "./data";
import { TablesList } from "./tables-list";

type TablesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TablesPage({ searchParams }: TablesPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { tables, error: tablesError } = await getOwnerTables(owner.id, query);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? tablesError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Meja</CardTitle>
            <CardDescription>
              Kelola {tables.length} meja yang akan dipakai pelanggan untuk
              membuka menu.
            </CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/tables/form">Tambah meja</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari nomor meja..." />
          </Suspense>
          <TablesList tables={tables} />
        </CardContent>
      </Card>
    </div>
  );
}
