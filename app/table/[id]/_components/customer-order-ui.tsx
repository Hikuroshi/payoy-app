import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { formatPrice, type CustomerCartItem } from "./customer-cart";

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function CustomerPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-4 px-4 py-4 pb-10 sm:px-5 md:px-6">
        {children}
      </div>
    </main>
  );
}

export function CustomerPageHeader({
  backHref,
  description,
  tableNumber,
  title,
}: {
  backHref?: string;
  description?: string;
  tableNumber: string;
  title: string;
}) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold leading-tight tracking-normal sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="pt-1 text-sm font-extrabold text-muted-foreground sm:text-base">
          Meja #{tableNumber}
        </p>
        {backHref ? (
          <Button asChild size="sm" variant="outline">
            <Link href={backHref}>Kembali</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
}

export function CustomerItemImage({
  alt,
  src,
}: {
  alt: string;
  src: string;
}) {
  if (!src) {
    return (
      <div className="flex size-20 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
      <Image
        alt={alt}
        className="object-cover"
        fill
        sizes="80px"
        src={src}
        unoptimized
      />
    </div>
  );
}

export function EmptyCustomerState({
  description,
  href,
  label,
  title,
}: {
  description: string;
  href: string;
  label: string;
  title: string;
}) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild>
          <Link href={href}>{label}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function OrderTotals({
  adminFee,
  subtotal,
  tax,
  total,
}: {
  adminFee: number;
  subtotal: number;
  tax: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center justify-between gap-3 text-muted-foreground">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-muted-foreground">
        <span>Biaya admin</span>
        <span>{formatPrice(adminFee)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-muted-foreground">
        <span>Pajak</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="border-t border-dashed" />
      <div className="flex items-center justify-between gap-3 text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

export function OrderItemRow({ item }: { item: CustomerCartItem }) {
  return (
    <div className="flex gap-3 rounded-md border p-3">
      <CustomerItemImage alt={item.name} src={item.imageUrl} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 font-semibold">{item.name}</h2>
          <span className="shrink-0 font-medium">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {item.quantity} x {formatPrice(item.price)}
        </p>
        {item.note ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            Catatan: {item.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function CustomerPageSkeleton() {
  return (
    <CustomerPageShell>
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-7 w-20" />
      </header>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="flex gap-3 rounded-md border p-3" key={index}>
                <Skeleton className="size-20 rounded-md" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-7 w-full" />
          </CardContent>
        </Card>
      </div>
    </CustomerPageShell>
  );
}
