import Link from "next/link";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUserProfile } from "@/lib/auth/profile";

import { getDashboardSummary } from "./data";
import { OrdersTable } from "./orders/orders-table";

export default async function Page() {
  const profile = await requireUserProfile();
  const summary = await getDashboardSummary(profile);
  const canManageOrders = profile.role === "owner" || profile.role === "cashier";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
          <CardDescription>Data terbaru dari pesanan yang masuk ke meja pelanggan.</CardDescription>
          {canManageOrders ? (
            <CardAction>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/orders">Lihat semua</Link>
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent>
          <OrdersTable emptyMessage="Belum ada pesanan." orders={summary.recentOrders} redirectTo="/dashboard" showActions={false} />
        </CardContent>
      </Card>
    </div>
  );
}
