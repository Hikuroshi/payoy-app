"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { formatPrice, getInitials, type MenuCategory, type MenuFood } from "./menu-data";

function MenuImage({ alt, className, eager = false, sizes, src }: { alt: string; className?: string; eager?: boolean; sizes: string; src: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const isRemoteImage = src.startsWith("http");

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && !failed ? <Skeleton className="absolute inset-0 size-full rounded-[inherit]" /> : null}

      {failed ? (
        <div className="flex size-full items-center justify-center rounded-[inherit] bg-muted text-xs font-semibold text-muted-foreground">{getInitials(alt)}</div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          fetchPriority={eager ? "high" : undefined}
          loading={eager ? "eager" : "lazy"}
          sizes={sizes}
          unoptimized={isRemoteImage}
          className={cn("object-cover transition-opacity", loaded ? "opacity-100" : "opacity-0")}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

export function CategoryButton({ active, category, onSelect }: { active: boolean; category: MenuCategory; onSelect: (categoryName: string) => void }) {
  return (
    <Button type="button" variant={active ? "secondary" : "ghost"} aria-pressed={active} className="h-auto min-w-20 flex-col gap-1.5 px-2 py-2" onClick={() => onSelect(category.name)}>
      <Avatar className={cn("size-10 border bg-muted sm:size-11", active && "ring-2 ring-ring/50")}>
        <AvatarImage src={category.thumbnail} alt={category.name} loading="lazy" />
        <AvatarFallback className="text-xs">{getInitials(category.name)}</AvatarFallback>
      </Avatar>

      <span className="max-w-20 truncate text-xs font-medium">{category.name}</span>
    </Button>
  );
}

export function CategorySkeletons() {
  return (
    <div className="flex w-max gap-2 px-4 sm:px-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex min-w-20 flex-col items-center gap-1.5 px-2 py-2">
          <Skeleton className="size-10 rounded-full sm:size-11" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

export function FoodSkeletons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden p-0">
          <CardContent className="grid grid-cols-[72px_1fr] gap-3 p-2.5 sm:grid-cols-[84px_1fr]">
            <Skeleton className="aspect-square rounded-md" />

            <div className="flex min-w-0 flex-col justify-center gap-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MenuItemCard({ eager, item, onAdd }: { eager?: boolean; item: MenuFood; onAdd: (item: MenuFood) => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid grid-cols-[72px_1fr] gap-3 p-2.5 sm:grid-cols-[84px_1fr]">
        <Link href={`/menu/${item.id}`} className="block">
          <MenuImage alt={item.name} eager={eager} sizes="(max-width: 640px) 72px, 84px" src={item.thumbnail} className="aspect-square rounded-md" />
        </Link>

        <div className="flex min-w-0 flex-col items-start justify-center">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            <Link href={`/menu/${item.id}`} className="hover:underline">
              {item.name}
            </Link>
          </h3>

          <p className="mt-0.5 text-xs text-muted-foreground">{formatPrice(item.price)}</p>

          <Button type="button" size="sm" className="mt-2 h-7 min-w-20 px-3 text-xs" onClick={() => onAdd(item)}>
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MenuEmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="p-0">
      <CardContent className="flex min-h-32 flex-col items-center justify-center gap-2 p-5 text-center">
        <p className="text-xs text-muted-foreground sm:text-sm">Menu belum tersedia untuk kategori ini.</p>

        <Button type="button" variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onRetry}>
          Muat ulang
        </Button>
      </CardContent>
    </Card>
  );
}

export function CheckoutBar({ count, total }: { count: number; total: number }) {
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
