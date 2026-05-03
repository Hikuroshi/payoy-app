"use client";

import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type PublicMenuFood = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

function formatPrice(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
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

function MenuImage({ item }: { item: PublicMenuFood }) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  if (!item.imageUrl || failed) {
    return <MenuImagePlaceholder name={item.name} />;
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
      {!loaded ? <Skeleton className="absolute inset-0 rounded-none" /> : null}
      <Image alt={item.name} className="object-cover" fill onError={() => setFailed(true)} onLoad={() => setLoaded(true)} sizes="(max-width: 640px) 72px, 84px" src={item.imageUrl} unoptimized />
    </div>
  );
}

function MenuItemCard({ item, onAdd }: { item: PublicMenuFood; onAdd: (item: PublicMenuFood) => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid grid-cols-[72px_1fr] gap-3 p-2.5 sm:grid-cols-[84px_1fr]">
        <MenuImage item={item} />

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

function CheckoutBar({ count, total }: { count: number; total: number }) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-3 sm:px-5 md:px-6">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Total: {count} item</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Button type="button" size="sm" className="w-full" disabled={count === 0}>
          Checkout
        </Button>
      </div>
    </div>
  );
}

export function MenuView({ errorMessage, foods, tableNumber }: { errorMessage?: string; foods: PublicMenuFood[]; tableNumber: string }) {
  const [cartSummary, setCartSummary] = React.useState({
    count: 0,
    total: 0,
  });

  function handleAddItem(item: PublicMenuFood) {
    setCartSummary((current) => ({
      count: current.count + 1,
      total: current.total + item.price,
    }));

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
            {foods.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {foods.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} />
                ))}
              </div>
            ) : (
              <MenuEmptyState message={errorMessage ?? "Menu belum tersedia untuk meja ini."} />
            )}
          </div>
        </section>
      </div>

      <CheckoutBar count={cartSummary.count} total={cartSummary.total} />
    </div>
  );
}
