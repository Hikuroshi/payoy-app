"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  clearCart,
  createOrderSnapshot,
  formatDateTime,
  formatPrice,
  saveOrder,
} from "../../../_components/customer-cart";
import {
  CustomerPageHeader,
  CustomerPageShell,
  EmptyCustomerState,
} from "../../../_components/customer-order-ui";
import {
  createCustomerOrder,
  markCustomerOrderPaid,
} from "../../../_components/order-actions";
import {
  useCartItems,
  useLatestOrder,
} from "../../../_components/customer-store-hooks";

function QrisCode() {
  return (
    <div className="flex size-56 items-center justify-center rounded-md border bg-background p-3">
      <Image
        alt="QRIS pembayaran Payoy"
        className="size-full object-contain"
        height={200}
        src="/img/qrcode_example_pay.png"
        width={200}
      />
    </div>
  );
}

type QrisPaymentViewProps = {
  tableId: string;
  tableNumber: string;
};

export function QrisPaymentView({
  tableId,
  tableNumber,
}: QrisPaymentViewProps) {
  const router = useRouter();
  const items = useCartItems(tableId);
  const order = useLatestOrder(tableId);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!order && items.length > 0) {
      createOrderSnapshot(tableId, tableNumber, "QRIS");
    }
  }, [items.length, order, tableId, tableNumber]);

  function handleDownload() {
    toast.success("QRIS siap disimpan", {
      description: "Gunakan tangkapan layar untuk menyimpan QRIS.",
      position: "top-center",
    });
  }

  function handlePaid() {
    startTransition(async () => {
      if (!order) {
        toast.error("Data pembayaran tidak ditemukan", {
          position: "top-center",
        });
        return;
      }

      let paidAt = new Date().toISOString();
      let paidOrder = order;

      if (!paidOrder.databaseId) {
        const created = await createCustomerOrder({
          items: items.map((item) => ({
            id: item.id,
            note: item.note,
            quantity: item.quantity,
          })),
          paymentMethod: "QRIS",
          tableId,
        });

        if (created.error || !created.order?.databaseId) {
          toast.error(created.error ?? "Pesanan gagal disimpan.", {
            position: "top-center",
          });
          return;
        }

        paidOrder = created.order;
      }

      if (paidOrder.databaseId) {
        const result = await markCustomerOrderPaid({ id: paidOrder.databaseId });

        if (result.error) {
          toast.error(result.error, {
            position: "top-center",
          });
          return;
        }

        paidAt = result.paidAt ?? paidAt;
      }

      saveOrder({
        ...paidOrder,
        paidAt,
        status: "paid",
      });
      clearCart(tableId);

      router.push(`/table/${tableId}/status-payment`);
    });
  }

  if (!order) {
    return (
      <CustomerPageShell>
        <CustomerPageHeader
          backHref={`/table/${tableId}/checkout`}
          description="Tidak ada pesanan yang perlu dibayar."
          tableNumber={tableNumber}
          title="QRIS"
        />
        <EmptyCustomerState
          description="Kembali ke menu untuk membuat pesanan baru."
          href={`/table/${tableId}/menu`}
          label="Lihat menu"
          title="Pesanan tidak ditemukan"
        />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        backHref={`/table/${tableId}/checkout`}
        description={`Berlaku sampai ${formatDateTime(order.expiryAt)}.`}
        tableNumber={tableNumber}
        title="QRIS"
      />

      <Card className="mx-auto w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Payoy</CardTitle>
          <CardDescription>{order.id}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5">
          <p className="text-3xl font-black">{formatPrice(order.total)}</p>
          <QrisCode />
          <div className="flex w-full flex-col gap-2">
            <Button disabled={isPending} onClick={handlePaid} type="button">
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Menyimpan
                </>
              ) : (
                "Saya sudah bayar"
              )}
            </Button>
            <Button onClick={handleDownload} type="button" variant="outline">
              <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
              Unduh QRIS
            </Button>
            <Button asChild variant="outline">
              <Link href={`/table/${tableId}/checkout`}>
                Ganti metode pembayaran
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </CustomerPageShell>
  );
}
