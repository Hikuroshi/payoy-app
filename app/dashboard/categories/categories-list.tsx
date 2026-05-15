"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { deleteCategory } from "./actions";
import type { FoodCategory } from "./data";
import { DeleteCategoryDialog } from "./delete-category-dialog";

function CategoryRow({
  category,
  onDelete,
}: {
  category: FoodCategory;
  onDelete: (id: string) => void;
}) {
  async function optimisticDelete(formData: FormData) {
    React.startTransition(() => {
      onDelete(category.id);
    });
    await deleteCategory(formData);
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(category.createdAt).toLocaleDateString("id-ID")}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/categories/form/${category.id}`}>Edit</Link>
          </Button>
          <DeleteCategoryDialog
            action={optimisticDelete}
            id={category.id}
            name={category.name}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function CategoriesList({ categories }: { categories: FoodCategory[] }) {
  const [optimisticCategories, removeCategory] = React.useOptimistic(
    categories,
    (currentCategories: FoodCategory[], deletedId: string) =>
      currentCategories.filter((category) => category.id !== deletedId)
  );

  if (!optimisticCategories.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">
        Belum ada kategori.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead className="min-w-36">Dibuat</TableHead>
          <TableHead className="w-40 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticCategories.map((category) => (
          <CategoryRow
            category={category}
            key={category.id}
            onDelete={removeCategory}
          />
        ))}
      </TableBody>
    </Table>
  );
}
