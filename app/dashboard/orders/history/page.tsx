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

import { getDashboardOrders } from "../data";
import { OrdersTable } from "../orders-table";

type OrderHistoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderHistoryPage({
  searchParams,
}: OrderHistoryPageProps) {
  const profile = await requireOrderStaffProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { error: ordersError, orders } = await getDashboardOrders(
    profile,
    "history",
    query
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? ordersError} success={success} />
      <Card>
        <CardHeader>
          <CardTitle>History Pesanan</CardTitle>
          <CardDescription>
            Arsip pesanan yang sudah selesai atau dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari kode, meja, status, atau item..." />
          </Suspense>
          <OrdersTable
            emptyMessage="Belum ada history pesanan."
            orders={orders}
            redirectTo="/dashboard/orders/history"
            showActions={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
