import { Suspense } from "react";

import { StatusToast } from "@/components/status-toast";
import { UrlSearchInput } from "@/components/url-search-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getParamValue, normalizeSearchQuery } from "@/lib/search";
import { requireOrderStaffProfile } from "@/lib/auth/profile";

import { getDashboardOrders } from "./data";
import { OrdersTable } from "./orders-table";

export const metadata = {
  title: "Pesanan",
};

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const profile = await requireOrderStaffProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { error: ordersError, orders } = await getDashboardOrders(
    profile,
    "active",
    query
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? ordersError} success={success} />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            Pantau pesanan yang menunggu pembayaran, sudah dibayar, atau sedang
            diproses.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari kode, meja, status, atau item..." />
          </Suspense>
          <OrdersTable
            emptyMessage="Belum ada pesanan aktif."
            orders={orders}
            redirectTo="/dashboard/orders"
          />
        </CardContent>
      </Card>
    </div>
  );
}
