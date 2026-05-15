"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { deleteFood } from "./actions";
import type { Food } from "./data";
import { DeleteFoodDialog } from "./delete-food-dialog";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
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

function FoodThumbnail({ food }: { food: Food }) {
  if (!food.imageUrl) {
    return <div className="flex size-12 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">{getInitials(food.name)}</div>;
  }

  return (
    <div className="relative size-12 overflow-hidden rounded-md border bg-muted">
      <Image alt={food.name} className="object-cover" fill sizes="48px" src={food.imageUrl} unoptimized loading="eager" />
    </div>
  );
}

function FoodRow({ food, onDelete }: { food: Food; onDelete: (id: string) => void }) {
  async function optimisticDelete(formData: FormData) {
    React.startTransition(() => {
      onDelete(food.id);
    });
    await deleteFood(formData);
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-44 items-center gap-3">
          <FoodThumbnail food={food} />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-medium">{food.name}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {food.categoryName || "Tanpa kategori"}
              </Badge>
            </div>
            <span className="text-[0.625rem] text-muted-foreground">Dibuat {new Date(food.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{food.description || "-"}</TableCell>
      <TableCell>{formatCurrency(food.price)}</TableCell>
      <TableCell>
        <Badge variant={food.isAvailable ? "secondary" : "outline"}>{food.isAvailable ? "Tersedia" : "Disembunyikan"}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/foods/form/${food.id}`}>Edit</Link>
          </Button>
          <DeleteFoodDialog action={optimisticDelete} id={food.id} name={food.name} />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function FoodsList({ foods }: { foods: Food[] }) {
  const [optimisticFoods, removeFood] = React.useOptimistic(foods, (currentFoods: Food[], deletedId: string) => currentFoods.filter((food) => food.id !== deletedId));

  if (!optimisticFoods.length) {
    return <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">Belum ada makanan.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-44">Nama</TableHead>
          <TableHead className="min-w-44">Deskripsi</TableHead>
          <TableHead className="min-w-36">Harga</TableHead>
          <TableHead className="min-w-28">Status</TableHead>
          <TableHead className="w-40 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticFoods.map((food) => (
          <FoodRow key={food.id} food={food} onDelete={removeFood} />
        ))}
      </TableBody>
    </Table>
  );
}
