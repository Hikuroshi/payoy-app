"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { UrlSearchInput } from "@/components/url-search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { addCartItem, formatPrice, getCartTotals, getTotalQuantity, type CustomerCartItem } from "../_components/customer-cart";
import { useCartItems } from "../_components/customer-store-hooks";

export type PublicMenuFood = {
  categoryName: string;
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

export type PublicMenuCategory = {
  id: string;
  imageUrl: string;
  name: string;
};

type CartOptimisticAction = {
  item: PublicMenuFood;
  type: "add";
};

function reduceCartItems(currentItems: CustomerCartItem[], action: CartOptimisticAction) {
  if (action.type !== "add") {
    return currentItems;
  }

  const currentItem = currentItems.find((item) => item.id === action.item.id);

  if (currentItem) {
    return currentItems.map((item) => (item.id === action.item.id ? { ...item, quantity: item.quantity + 1 } : item));
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

function MenuImagePlaceholder({ className, name }: { className?: string; name: string }) {
  return <div className={cn("flex items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground", className)}>{getInitials(name)}</div>;
}

function MenuImage({ containerClassName, item, loading = "lazy", sizes = "(max-width: 640px) 72px, 84px" }: { containerClassName?: string; item: PublicMenuFood; loading?: "eager" | "lazy"; sizes?: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  if (!item.imageUrl || failed) {
    return <MenuImagePlaceholder className={containerClassName} name={item.name} />;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", containerClassName)}>
      {!loaded ? <Skeleton className="absolute inset-0 rounded-none" /> : null}
      <Image alt={item.name} className="object-cover" fill loading={loading} onError={() => setFailed(true)} onLoad={() => setLoaded(true)} sizes={sizes} src={item.imageUrl} unoptimized />
    </div>
  );
}

function MenuItemCard({ imageLoading = "lazy", item, onAdd, onSelect }: { imageLoading?: "eager" | "lazy"; item: PublicMenuFood; onAdd: (item: PublicMenuFood) => void; onSelect: (item: PublicMenuFood) => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent
        className="grid cursor-pointer grid-cols-[72px_1fr] gap-3 p-2.5 transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:grid-cols-[84px_1fr]"
        onClick={() => onSelect(item)}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(item);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <MenuImage containerClassName="aspect-square" item={item} loading={imageLoading} />

        <div className="flex min-w-0 flex-col items-start justify-center">
          {item.categoryName ? (
            <Badge className="mb-1" variant="outline">
              {item.categoryName}
            </Badge>
          ) : null}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{item.name}</h3>

          <p className="mt-0.5 text-xs text-muted-foreground">{formatPrice(item.price)}</p>

          {item.description ? <p className="mt-1 line-clamp-1 text-[0.625rem] text-muted-foreground">{item.description}</p> : null}

          <Button
            type="button"
            size="sm"
            className="mt-2 h-7 min-w-20 px-3 text-xs"
            onClick={(event) => {
              event.stopPropagation();
              onAdd(item);
            }}
          >
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryFilterScroller({
  categories,
  selectedCategoryId,
}: {
  categories: PublicMenuCategory[];
  selectedCategoryId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = React.useCallback((categoryId: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (selectedCategoryId === categoryId) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryId);
    }

    const nextSearch = nextParams.toString();

    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams, selectedCategoryId]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max items-start gap-4">
        {categories.map((category, index) => {
          const isActive = selectedCategoryId === category.id;

          return (
            <button
              aria-pressed={isActive}
              className="flex w-20 shrink-0 flex-col items-center gap-2 text-center"
              key={category.id}
              onClick={() => handleSelect(category.id)}
              type="button"
            >
              <div className={cn("relative size-16 overflow-hidden rounded-full border-2 border-transparent bg-muted transition-all", isActive ? "border-primary ring-2 ring-primary/20" : "border-border/60")}>
                {category.imageUrl ? (
                  <Image
                    alt={category.name}
                    className="object-cover"
                    fill
                    loading={index < 4 ? "eager" : "lazy"}
                    sizes="64px"
                    src={category.imageUrl}
                    unoptimized
                  />
                ) : (
                  <MenuImagePlaceholder className="size-full rounded-full text-sm" name={category.name} />
                )}
              </div>
              <span className={cn("line-clamp-2 text-xs leading-tight text-muted-foreground", isActive && "font-semibold text-foreground")}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
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

function MenuDetailDrawer({ item, onAdd, onOpenChange }: { item: PublicMenuFood | null; onAdd: (item: PublicMenuFood) => void; onOpenChange: (open: boolean) => void }) {
  if (!item) {
    return null;
  }

  return (
    <Drawer open={Boolean(item)} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 before:inset-0 before:rounded-t-3xl before:rounded-b-none data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">
            <div className="flex flex-col gap-4">
              <MenuImage containerClassName="aspect-[4/3] w-full rounded-xl" item={item} loading="eager" sizes="(max-width: 640px) 100vw, 448px" />

              <div className="flex items-start justify-between gap-3">
                <DrawerHeader className="min-w-0 p-0 text-left">
                  {item.categoryName ? (
                    <Badge className="mb-2 w-fit" variant="outline">
                      {item.categoryName}
                    </Badge>
                  ) : null}
                  <DrawerTitle className="text-start text-base font-semibold text-foreground">{item.name}</DrawerTitle>
                  <DrawerDescription className="mt-1 text-start text-sm text-muted-foreground">{item.description || "Menu yang sedap dan menggoda untuk anda makan."}</DrawerDescription>
                </DrawerHeader>

                <p className="shrink-0 pt-0.5 text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
              </div>
            </div>
          </div>

          <DrawerFooter className="mt-0 shrink-0 border-t bg-background/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
            <Button className="w-full" onClick={() => onAdd(item)} type="button">
              Tambah ke keranjang
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CheckoutBar({ count, href, total }: { count: number; href: string; total: number }) {
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
  categories,
  errorMessage,
  foods,
  query,
  selectedCategoryId,
  selectedCategoryName,
  tableId,
  tableNumber,
}: {
  categories: PublicMenuCategory[];
  errorMessage?: string;
  foods: PublicMenuFood[];
  query?: string;
  selectedCategoryId?: string;
  selectedCategoryName?: string;
  tableId: string;
  tableNumber: string;
}) {
  const cartItems = useCartItems(tableId);
  const [selectedItem, setSelectedItem] = React.useState<PublicMenuFood | null>(null);
  const [optimisticCartItems, applyOptimisticCart] = React.useOptimistic(cartItems, reduceCartItems);
  const cartTotals = getCartTotals(optimisticCartItems);
  const cartCount = getTotalQuantity(optimisticCartItems);
  const router = useRouter();

  function handleAddItem(item: PublicMenuFood) {
    React.startTransition(() => {
      applyOptimisticCart({ item, type: "add" });
    });
    addCartItem(tableId, item);
    toast.success(`${item.name} ditambahkan ke keranjang`, { position: "top-center", duration: 1800 });
  }

  function handleAddFromDrawer(item: PublicMenuFood) {
    handleAddItem(item);
    setSelectedItem(null);
  }

  return (
    <div className="relative">
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col bg-background px-4 pb-28 pt-4 sm:px-5 md:px-6">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight tracking-normal sm:text-3xl">
              Menu
            </h1>
            {errorMessage ? (
              <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">
                {errorMessage}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <p className="pt-1 text-sm font-extrabold text-muted-foreground sm:text-base">
              Meja #{tableNumber}
            </p>

            <Button size="sm" variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
          </div>
        </header>

        <section className="mt-5">
          <React.Suspense fallback={null}>
            <UrlSearchInput className="mb-3.5" clearKeysOnChange={["category"]} placeholder="Cari menu makanan..." />
          </React.Suspense>

          {categories.length > 0 ? (
            <div className="mb-3.5">
              <React.Suspense fallback={null}>
                <CategoryFilterScroller categories={categories} selectedCategoryId={selectedCategoryId} />
              </React.Suspense>
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-3">
            <h2 className="min-w-0 truncate text-xl font-extrabold leading-tight tracking-normal sm:text-2xl">
              {query ? "Hasil pencarian" : selectedCategoryName ?? "Menu Makanan"}
            </h2>
          </div>

          <div className="mt-3.5">
            {foods.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {foods.map((item, index) => (
                  <MenuItemCard imageLoading={index < 3 ? "eager" : "lazy"} key={item.id} item={item} onAdd={handleAddItem} onSelect={setSelectedItem} />
                ))}
              </div>
            ) : (
              <MenuEmptyState message={errorMessage ?? (query ? `Tidak ada menu yang cocok dengan "${query}".` : "Menu belum tersedia untuk meja ini.")} />
            )}
          </div>
        </section>
      </div>

      <CheckoutBar count={cartCount} href={`/table/${tableId}/cart`} total={cartTotals.subtotal} />

      <MenuDetailDrawer
        item={selectedItem}
        onAdd={handleAddFromDrawer}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
          }
        }}
      />
    </div>
  );
}
