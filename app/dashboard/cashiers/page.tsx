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

import { getOwnerCashiers } from "./data";
import { CashiersTable } from "./cashiers-table";

type CashiersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CashiersPage({ searchParams }: CashiersPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { cashiers, error: cashiersError } = await getOwnerCashiers(owner.id, query);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? cashiersError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Cashier</CardTitle>
            <CardDescription>Kelola akun cashier untuk outlet owner ini.</CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/cashiers/form">Tambah cashier</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari cashier atau email..." />
          </Suspense>
          <CashiersTable cashiers={cashiers} />
        </CardContent>
      </Card>
    </div>
  );
}
