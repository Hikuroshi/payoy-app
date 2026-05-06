"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { clearCart, formatPrice, getCartTotals, getTotalQuantity, setCartItems, type CustomerCartItem } from "../_components/customer-cart";
import { CustomerItemImage, CustomerPageHeader, CustomerPageShell, EmptyCustomerState, OrderTotals } from "../_components/customer-order-ui";
import { useCartItems } from "../_components/customer-store-hooks";

type CartViewProps = {
  tableId: string;
  tableNumber: string;
};

type CartOptimisticAction =
  | { id: string; quantity: number; type: "set_quantity" }
  | { id: string; note: string; type: "set_note" }
  | { id: string; type: "remove" }
  | { type: "clear" };

function reduceCartItems(
  currentItems: CustomerCartItem[],
  action: CartOptimisticAction
) {
  if (action.type === "clear") {
    return [];
  }

  if (action.type === "remove") {
    return currentItems.filter((item) => item.id !== action.id);
  }

  if (action.type === "set_note") {
    return currentItems.map((item) =>
      item.id === action.id ? { ...item, note: action.note } : item
    );
  }

  return currentItems
    .map((item) =>
      item.id === action.id
        ? { ...item, quantity: Math.max(0, action.quantity) }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function CartView({ tableId, tableNumber }: CartViewProps) {
  const items = useCartItems(tableId);
  const [optimisticItems, applyOptimisticItems] = React.useOptimistic(
    items,
    reduceCartItems
  );

  function syncItems(nextItems: CustomerCartItem[]) {
    setCartItems(tableId, nextItems);
  }

  function updateQuantity(id: string, quantity: number) {
    const nextItems = reduceCartItems(optimisticItems, {
      id,
      quantity,
      type: "set_quantity",
    });

    React.startTransition(() => {
      applyOptimisticItems({ id, quantity, type: "set_quantity" });
    });
    syncItems(nextItems);
  }

  function updateNote(id: string, note: string) {
    const nextItems = reduceCartItems(optimisticItems, {
      id,
      note,
      type: "set_note",
    });

    React.startTransition(() => {
      applyOptimisticItems({ id, note, type: "set_note" });
    });
    syncItems(nextItems);
  }

  function removeItem(id: string) {
    const nextItems = reduceCartItems(optimisticItems, { id, type: "remove" });

    React.startTransition(() => {
      applyOptimisticItems({ id, type: "remove" });
    });
    syncItems(nextItems);
    toast.success("Item dihapus dari keranjang", { position: "top-center" });
  }

  function handleClearCart() {
    React.startTransition(() => {
      applyOptimisticItems({ type: "clear" });
    });
    clearCart(tableId);
    toast.success("Keranjang dikosongkan", { position: "top-center" });
  }

  if (!optimisticItems.length) {
    return (
      <CustomerPageShell>
        <CustomerPageHeader backHref={`/table/${tableId}/menu`} description="Tambahkan makanan dari halaman menu terlebih dahulu." tableNumber={tableNumber} title="Keranjang" />
        <EmptyCustomerState description="Belum ada item di keranjang meja ini." href={`/table/${tableId}/menu`} label="Lihat menu" title="Keranjang kosong" />
      </CustomerPageShell>
    );
  }

  const totals = getCartTotals(optimisticItems);

  return (
    <CustomerPageShell>
      <CustomerPageHeader backHref={`/table/${tableId}/menu`} description="Atur jumlah dan catatan sebelum checkout." tableNumber={tableNumber} title="Keranjang" />

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader>
            <CardTitle>{getTotalQuantity(optimisticItems)} item pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {optimisticItems.map((item) => (
              <div className="flex flex-col gap-3 rounded-md border p-3" key={item.id}>
                <div className="flex gap-3">
                  <CustomerItemImage alt={item.name} src={item.imageUrl} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 font-semibold">{item.name}</h2>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <Button onClick={() => removeItem(item.id)} size="sm" type="button" variant="destructive">
                        Hapus
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} size="icon-sm" type="button" variant="outline">
                        -
                      </Button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} size="icon-sm" type="button" variant="outline">
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <Textarea onChange={(event) => updateNote(item.id, event.target.value)} placeholder="Catatan untuk item ini" value={item.note} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <OrderTotals {...totals} />
            <Button asChild>
              <Link href={`/table/${tableId}/checkout`}>Checkout</Link>
            </Button>
            <Button onClick={handleClearCart} type="button" variant="outline">
              Kosongkan
            </Button>
          </CardContent>
        </Card>
      </div>
    </CustomerPageShell>
  );
}
