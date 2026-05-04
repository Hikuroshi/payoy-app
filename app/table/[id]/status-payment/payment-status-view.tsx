"use client";

import { CheckmarkCircle02Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatPrice } from "../_components/customer-cart";
import { CustomerPageHeader, CustomerPageShell, EmptyCustomerState } from "../_components/customer-order-ui";
import { useSyncedLatestOrder } from "../_components/customer-store-hooks";

type PaymentStatusViewProps = {
  tableId: string;
  tableNumber: string;
};

export function PaymentStatusView({ tableId, tableNumber }: PaymentStatusViewProps) {
  const order = useSyncedLatestOrder(tableId);

  function handleDownloadReceipt() {
    toast.success("Struk siap disimpan", {
      description: order ? `Struk ${order.id} berhasil dibuat.` : undefined,
      position: "top-center",
    });
  }

  if (!order) {
    return (
      <CustomerPageShell>
        <CustomerPageHeader backHref={`/table/${tableId}/menu`} description="Belum ada pembayaran untuk meja ini." tableNumber={tableNumber} title="Status Pembayaran" />
        <EmptyCustomerState description="Kembali ke menu untuk membuat pesanan baru." href={`/table/${tableId}/menu`} label="Lihat menu" title="Pembayaran tidak ditemukan" />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader description="Pembayaran berhasil. Pesanan akan diproses." tableNumber={tableNumber} title="Status Pembayaran" />

      <Card className="mx-auto w-full max-w-sm text-center">
        <CardHeader className="flex flex-col items-center text-center">
          <HugeiconsIcon className="text-primary" icon={CheckmarkCircle02Icon} size={64} />
          <CardTitle>Yeay Berhasil!</CardTitle>
          <CardDescription>Total pembayaran {formatPrice(order.total)}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <Button onClick={handleDownloadReceipt} type="button" variant="outline">
            <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
            Unduh struk
          </Button>

          <Button asChild>
            <Link href={`/table/${tableId}/status-order`}>Pantau pesanan</Link>
          </Button>
        </CardContent>
      </Card>
    </CustomerPageShell>
  );
}
