"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteRestaurantTable } from "./actions";
import type { RestaurantTable } from "./data";
import { DeleteTableDialog } from "./delete-table-dialog";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function TableRowItem({
  onDelete,
  table,
}: {
  onDelete: (id: string) => void;
  table: RestaurantTable;
}) {
  async function optimisticDelete(formData: FormData) {
    React.startTransition(() => {
      onDelete(table.id);
    });
    await deleteRestaurantTable(formData);
  }

  return (
    <TableRow>
      <TableCell className="font-medium">Meja {table.number}</TableCell>
      <TableCell>
        <Button asChild size="sm" variant="outline">
          <Link href={`/table/${table.id}/menu`}>Buka menu</Link>
        </Button>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(table.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/tables/form/${table.id}`}>Edit</Link>
          </Button>
          <DeleteTableDialog
            action={optimisticDelete}
            id={table.id}
            number={table.number}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TablesList({ tables }: { tables: RestaurantTable[] }) {
  const [optimisticTables, removeTable] = React.useOptimistic(
    tables,
    (currentTables: RestaurantTable[], deletedId: string) =>
      currentTables.filter((table) => table.id !== deletedId)
  );

  if (!optimisticTables.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">
        Belum ada meja.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-44">Nomor meja</TableHead>
          <TableHead className="min-w-44">Menu publik</TableHead>
          <TableHead className="min-w-36">Dibuat</TableHead>
          <TableHead className="w-40 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticTables.map((table) => (
          <TableRowItem key={table.id} onDelete={removeTable} table={table} />
        ))}
      </TableBody>
    </Table>
  );
}
