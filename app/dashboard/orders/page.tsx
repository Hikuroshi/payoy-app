import { StatusToast } from "@/components/status-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireOrderStaffProfile } from "@/lib/auth/profile";

import { getDashboardOrders } from "./data";
import { OrdersTable } from "./orders-table";

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const profile = await requireOrderStaffProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const { error: ordersError, orders } = await getDashboardOrders(
    profile,
    "active"
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
        <CardContent>
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
