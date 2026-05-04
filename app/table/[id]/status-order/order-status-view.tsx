"use client";

import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StepProgress from "@/components/ui/stepper";

import {
  formatDateTime,
  formatPrice,
  type CustomerOrderStatus,
} from "../_components/customer-cart";
import {
  CustomerPageHeader,
  CustomerPageShell,
  EmptyCustomerState,
  OrderItemRow,
} from "../_components/customer-order-ui";
import { useSyncedLatestOrder } from "../_components/customer-store-hooks";

const steps = [
  {
    icon: <HugeiconsIcon icon={Task01Icon} />,
    label: "Diterima",
  },
  {
    icon: <HugeiconsIcon icon={Clock01Icon} />,
    label: "Diproses",
  },
  {
    icon: <HugeiconsIcon icon={CheckmarkCircle02Icon} />,
    label: "Selesai",
  },
];

const orderStatuses: Record<
  CustomerOrderStatus,
  {
    description: string;
    step: number;
    title: string;
  }
> = {
  cancelled: {
    description: "Pesanan dibatalkan oleh kasir.",
    step: 1,
    title: "Pesanan dibatalkan",
  },
  done: {
    description: "Pesanan sudah selesai diproses.",
    step: 3,
    title: "Pesanan selesai",
  },
  paid: {
    description: "Pesanan sudah diterima oleh kasir.",
    step: 1,
    title: "Pesanan diterima",
  },
  processing: {
    description: "Dapur sedang menyiapkan pesanan.",
    step: 2,
    title: "Pesanan diproses",
  },
  waiting_payment: {
    description: "Pembayaran pesanan masih menunggu konfirmasi.",
    step: 1,
    title: "Menunggu pembayaran",
  },
};

type OrderStatusViewProps = {
  tableId: string;
  tableNumber: string;
};

function OrderLifecycleCard({
  children,
  status,
}: {
  children: React.ReactNode;
  status: CustomerOrderStatus;
}) {
  const currentStatus = orderStatuses[status];
  const currentStep = currentStatus.step;

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <CardTitle>{currentStatus.title}</CardTitle>
        <CardDescription>{currentStatus.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="mx-auto w-full max-w-md">
          <StepProgress currentStep={currentStep} steps={steps} />
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function OrderStatusView({
  tableId,
  tableNumber,
}: OrderStatusViewProps) {
  const order = useSyncedLatestOrder(tableId);

  if (!order) {
    return (
      <CustomerPageShell>
        <CustomerPageHeader
          backHref={`/table/${tableId}/menu`}
          description="Belum ada pesanan untuk meja ini."
          tableNumber={tableNumber}
          title="Status Pesanan"
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
        description="Pesanan sudah diterima dan sedang diproses."
        tableNumber={tableNumber}
        title="Status Pesanan"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <OrderLifecycleCard key={order.id} status={order.status}>
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">No. Pesanan</span>
              <span className="font-semibold">{order.id}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Meja</span>
              <span className="font-semibold">#{order.tableNumber}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Pembayaran</span>
              <span className="font-semibold">{order.paymentMethod}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Waktu</span>
              <span className="text-right font-semibold">
                {formatDateTime(order.createdAt)}
              </span>
            </div>
            <div className="mt-4 border-t border-dashed pt-4">
              <div className="flex items-center justify-between gap-3 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </OrderLifecycleCard>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Ringkasan pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {order.items.map((item) => (
              <OrderItemRow item={item} key={item.id} />
            ))}
            <Button asChild className="mt-2">
              <Link href={`/table/${tableId}/menu`}>Kembali ke menu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </CustomerPageShell>
  );
}
