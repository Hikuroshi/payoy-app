"use client";

import * as React from "react";

import { PendingButton } from "@/components/pending-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { updateOrderStatus } from "./actions";
import type { DashboardOrder, OrderStatus } from "./data";

export const orderStatusLabels: Record<OrderStatus, string> = {
  cancelled: "Dibatalkan",
  done: "Selesai",
  paid: "Dibayar",
  processing: "Diproses",
  waiting_payment: "Menunggu bayar",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatOrderDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusVariant(status: OrderStatus) {
  if (status === "done") {
    return "default";
  }

  if (status === "paid" || status === "processing") {
    return "secondary";
  }

  return "outline";
}

function OrderItems({ order }: { order: DashboardOrder }) {
  return (
    <div className="flex min-w-52 flex-col gap-1">
      {order.items.map((item) => (
        <div className="text-xs/relaxed" key={item.id}>
          <span className="font-medium">{item.quantity}x </span>
          {item.foodName}
          {item.note ? (
            <span className="text-muted-foreground"> - {item.note}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function OrderStatusForm({
  action,
  children,
  order,
  pendingText,
  redirectTo,
  status,
  variant = "outline",
}: {
  action?: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  order: DashboardOrder;
  pendingText: string;
  redirectTo: string;
  status: OrderStatus;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <form action={action ?? updateOrderStatus}>
      <input name="id" type="hidden" value={order.id} />
      <input name="status" type="hidden" value={status} />
      <input name="redirectTo" type="hidden" value={redirectTo} />
      <PendingButton pendingText={pendingText} size="sm" type="submit" variant={variant}>
        {children}
      </PendingButton>
    </form>
  );
}

function OrderActions({
  onUpdate,
  order,
  redirectTo,
}: {
  onUpdate: (formData: FormData) => void | Promise<void>;
  order: DashboardOrder;
  redirectTo: string;
}) {
  if (order.status === "waiting_payment") {
    return (
      <OrderStatusForm
        action={onUpdate}
        order={order}
        pendingText="Membatalkan..."
        redirectTo={redirectTo}
        status="cancelled"
        variant="outline"
      >
        Batalkan
      </OrderStatusForm>
    );
  }

  if (order.status === "paid") {
    return (
      <div className="flex justify-end gap-2">
        <OrderStatusForm
          action={onUpdate}
          order={order}
          pendingText="Memproses..."
          redirectTo={redirectTo}
          status="processing"
        >
          Proses
        </OrderStatusForm>
        <OrderStatusForm
          action={onUpdate}
          order={order}
          pendingText="Membatalkan..."
          redirectTo={redirectTo}
          status="cancelled"
          variant="outline"
        >
          Batalkan
        </OrderStatusForm>
      </div>
    );
  }

  if (order.status === "processing") {
    return (
      <div className="flex justify-end gap-2">
        <OrderStatusForm
          action={onUpdate}
          order={order}
          pendingText="Menyelesaikan..."
          redirectTo={redirectTo}
          status="done"
        >
          Selesai
        </OrderStatusForm>
        <OrderStatusForm
          action={onUpdate}
          order={order}
          pendingText="Membatalkan..."
          redirectTo={redirectTo}
          status="cancelled"
          variant="outline"
        >
          Batalkan
        </OrderStatusForm>
      </div>
    );
  }

  return null;
}

type OptimisticOrderUpdate = {
  completedAt: string | null;
  status: OrderStatus;
};

function OrderRow({
  order,
  redirectTo,
  showActions,
}: {
  order: DashboardOrder;
  redirectTo: string;
  showActions: boolean;
}) {
  const [optimisticOrder, applyOptimisticUpdate] = React.useOptimistic(
    order,
    (
      currentOrder: DashboardOrder,
      optimisticUpdate: OptimisticOrderUpdate
    ): DashboardOrder => ({
      ...currentOrder,
      completedAt: optimisticUpdate.completedAt,
      status: optimisticUpdate.status,
    })
  );

  async function optimisticUpdateStatus(formData: FormData) {
    const nextStatus = formData.get("status");

    if (typeof nextStatus === "string") {
      const status = nextStatus as OrderStatus;
      React.startTransition(() => {
        applyOptimisticUpdate({
          completedAt:
            status === "done" || status === "cancelled"
              ? new Date().toISOString()
              : null,
          status,
        });
      });
    }

    await updateOrderStatus(formData);
  }

  const shouldHide =
    redirectTo === "/dashboard/orders" &&
    (optimisticOrder.status === "done" || optimisticOrder.status === "cancelled");

  if (shouldHide) {
    return null;
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{optimisticOrder.code}</TableCell>
      <TableCell>Meja {optimisticOrder.tableNumber}</TableCell>
      <TableCell>
        <OrderItems order={optimisticOrder} />
      </TableCell>
      <TableCell>{optimisticOrder.paymentMethod}</TableCell>
      <TableCell>{formatCurrency(optimisticOrder.total)}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatOrderDate(optimisticOrder.createdAt)}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(optimisticOrder.status)}>
          {orderStatusLabels[optimisticOrder.status]}
        </Badge>
      </TableCell>
      {showActions ? (
        <TableCell>
          <div className="flex justify-end">
            <OrderActions
              onUpdate={optimisticUpdateStatus}
              order={optimisticOrder}
              redirectTo={redirectTo}
            />
          </div>
        </TableCell>
      ) : null}
    </TableRow>
  );
}

export function OrdersTable({
  emptyMessage,
  orders,
  redirectTo,
  showActions = true,
}: {
  emptyMessage: string;
  orders: DashboardOrder[];
  redirectTo: string;
  showActions?: boolean;
}) {
  if (!orders.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-32">Kode</TableHead>
          <TableHead className="min-w-28">Meja</TableHead>
          <TableHead className="min-w-52">Item</TableHead>
          <TableHead className="min-w-32">Pembayaran</TableHead>
          <TableHead className="min-w-36">Total</TableHead>
          <TableHead className="min-w-40">Waktu</TableHead>
          <TableHead className="min-w-36">Status</TableHead>
          {showActions ? (
            <TableHead className="w-44 text-right">Aksi</TableHead>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            redirectTo={redirectTo}
            showActions={showActions}
          />
        ))}
      </TableBody>
    </Table>
  );
}
