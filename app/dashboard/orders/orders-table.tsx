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
  children,
  order,
  pendingText,
  redirectTo,
  status,
  variant = "outline",
}: {
  children: React.ReactNode;
  order: DashboardOrder;
  pendingText: string;
  redirectTo: string;
  status: OrderStatus;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <form action={updateOrderStatus}>
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
  order,
  redirectTo,
}: {
  order: DashboardOrder;
  redirectTo: string;
}) {
  if (order.status === "waiting_payment") {
    return (
      <OrderStatusForm
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
          order={order}
          pendingText="Memproses..."
          redirectTo={redirectTo}
          status="processing"
        >
          Proses
        </OrderStatusForm>
        <OrderStatusForm
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
          order={order}
          pendingText="Menyelesaikan..."
          redirectTo={redirectTo}
          status="done"
        >
          Selesai
        </OrderStatusForm>
        <OrderStatusForm
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
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.code}</TableCell>
            <TableCell>Meja {order.tableNumber}</TableCell>
            <TableCell>
              <OrderItems order={order} />
            </TableCell>
            <TableCell>{order.paymentMethod}</TableCell>
            <TableCell>{formatCurrency(order.total)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatOrderDate(order.createdAt)}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {orderStatusLabels[order.status]}
              </Badge>
            </TableCell>
            {showActions ? (
              <TableCell>
                <div className="flex justify-end">
                  <OrderActions order={order} redirectTo={redirectTo} />
                </div>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
