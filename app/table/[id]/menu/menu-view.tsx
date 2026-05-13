"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { UrlSearchInput } from "@/components/url-search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  addCartItem,
  formatPrice,
  getCartTotals,
  getTotalQuantity,
  type CustomerCartItem,
} from "../_components/customer-cart";
import { useCartItems } from "../_components/customer-store-hooks";

export type PublicMenuFood = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

type CartOptimisticAction = {
  item: PublicMenuFood;
  type: "add";
};

function reduceCartItems(
  currentItems: CustomerCartItem[],
  action: CartOptimisticAction
) {
  if (action.type !== "add") {
    return currentItems;
  }

  const currentItem = currentItems.find((item) => item.id === action.item.id);

  if (currentItem) {
    return currentItems.map((item) =>
      item.id === action.item.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...currentItems, { ...action.item, note: "", quantity: 1 }];
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function MenuImagePlaceholder({ name }: { name: string }) {
  return <div className="flex aspect-square items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">{getInitials(name)}</div>;
}

function MenuImage({
  item,
  loading = "lazy",
}: {
  item: PublicMenuFood;
  loading?: "eager" | "lazy";
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  if (!item.imageUrl || failed) {
    return <MenuImagePlaceholder name={item.name} />;
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
      {!loaded ? <Skeleton className="absolute inset-0 rounded-none" /> : null}
      <Image
        alt={item.name}
        className="object-cover"
        fill
        loading={loading}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        sizes="(max-width: 640px) 72px, 84px"
        src={item.imageUrl}
        unoptimized
      />
    </div>
  );
}

function MenuItemCard({
  imageLoading = "lazy",
  item,
  onAdd,
}: {
  imageLoading?: "eager" | "lazy";
  item: PublicMenuFood;
  onAdd: (item: PublicMenuFood) => void;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid grid-cols-[72px_1fr] gap-3 p-2.5 sm:grid-cols-[84px_1fr]">
        <MenuImage item={item} loading={imageLoading} />

        <div className="flex min-w-0 flex-col items-start justify-center">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{item.name}</h3>

          <p className="mt-0.5 text-xs text-muted-foreground">{formatPrice(item.price)}</p>

          {item.description ? <p className="mt-1 line-clamp-1 text-[0.625rem] text-muted-foreground">{item.description}</p> : null}

          <Button type="button" size="sm" className="mt-2 h-7 min-w-20 px-3 text-xs" onClick={() => onAdd(item)}>
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MenuEmptyState({ message }: { message: string }) {
  return (
    <Card className="p-0">
      <CardContent className="flex min-h-32 flex-col items-center justify-center gap-2 p-5 text-center">
        <p className="text-xs text-muted-foreground sm:text-sm">{message}</p>
      </CardContent>
    </Card>
  );
}

function CheckoutBar({
  count,
  href,
  total,
}: {
  count: number;
  href: string;
  total: number;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-3 sm:px-5 md:px-6">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Total: {count} item</span>
          <span>{formatPrice(total)}</span>
        </div>

        {count > 0 ? (
          <Button asChild size="sm" className="w-full">
            <Link href={href}>Checkout</Link>
          </Button>
        ) : (
          <Button type="button" size="sm" className="w-full" disabled>
            Checkout
          </Button>
        )}
      </div>
    </div>
  );
}

export function MenuView({
  errorMessage,
  foods,
  query,
  tableId,
  tableNumber,
}: {
  errorMessage?: string;
  foods: PublicMenuFood[];
  query?: string;
  tableId: string;
  tableNumber: string;
}) {
  const cartItems = useCartItems(tableId);
  const [optimisticCartItems, applyOptimisticCart] = React.useOptimistic(
    cartItems,
    reduceCartItems
  );
  const cartTotals = getCartTotals(optimisticCartItems);
  const cartCount = getTotalQuantity(optimisticCartItems);

  function handleAddItem(item: PublicMenuFood) {
    React.startTransition(() => {
      applyOptimisticCart({ item, type: "add" });
    });
    addCartItem(tableId, item);
    toast.success(`${item.name} ditambahkan ke keranjang`, { position: "top-center", duration: 1800 });
  }

  return (
    <div className="relative">
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col bg-background px-4 pb-28 pt-4 sm:px-5 md:px-6">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight tracking-normal sm:text-3xl">Menu</h1>

            {errorMessage ? <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">{errorMessage}</p> : null}
          </div>

          <p className="shrink-0 pt-1 text-sm font-extrabold text-muted-foreground sm:text-base">Meja #{tableNumber}</p>
        </header>

        <section className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="min-w-0 truncate text-xl font-extrabold leading-tight tracking-normal sm:text-2xl">Menu Makanan</h2>
          </div>

          <div className="mt-3.5">
            <React.Suspense fallback={null}>
              <UrlSearchInput className="mb-3.5" placeholder="Cari menu makanan..." />
            </React.Suspense>
            {foods.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {foods.map((item, index) => (
                  <MenuItemCard
                    imageLoading={index < 3 ? "eager" : "lazy"}
                    key={item.id}
                    item={item}
                    onAdd={handleAddItem}
                  />
                ))}
              </div>
            ) : (
              <MenuEmptyState
                message={
                  errorMessage ??
                  (query
                    ? `Tidak ada menu yang cocok dengan "${query}".`
                    : "Menu belum tersedia untuk meja ini.")
                }
              />
            )}
          </div>
        </section>
      </div>

      <CheckoutBar
        count={cartCount}
        href={`/table/${tableId}/cart`}
        total={cartTotals.subtotal}
      />
    </div>
  );
}
