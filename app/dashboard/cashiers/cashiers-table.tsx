"use client";

import Link from "next/link";
import * as React from "react";

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

import { deleteDashboardCashier } from "./actions";
import type { DashboardCashier } from "./data";
import { DeleteCashierDialog } from "./delete-cashier-dialog";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CashierRow({
  cashier,
  onDelete,
}: {
  cashier: DashboardCashier;
  onDelete: (id: string) => void;
}) {
  async function optimisticDelete(formData: FormData) {
    React.startTransition(() => {
      onDelete(cashier.id);
    });
    await deleteDashboardCashier(formData);
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-48 flex-col gap-1">
          <span className="font-medium">{cashier.name}</span>
          <span className="text-[0.625rem] text-muted-foreground">
            Dibuat {formatDate(cashier.createdAt)}
          </span>
        </div>
      </TableCell>
      <TableCell>{cashier.email}</TableCell>
      <TableCell>
        <Badge variant="outline">Cashier</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(cashier.lastSignInAt)}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/cashiers/form/${cashier.id}`}>Edit</Link>
          </Button>
          <DeleteCashierDialog
            action={optimisticDelete}
            id={cashier.id}
            name={cashier.name}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function CashiersTable({
  cashiers,
}: {
  cashiers: DashboardCashier[];
}) {
  const [optimisticCashiers, removeCashier] = React.useOptimistic(
    cashiers,
    (currentCashiers: DashboardCashier[], deletedId: string) =>
      currentCashiers.filter((cashier) => cashier.id !== deletedId)
  );

  if (!optimisticCashiers.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">
        Belum ada cashier.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-52">Cashier</TableHead>
          <TableHead className="min-w-48">Email</TableHead>
          <TableHead className="min-w-32">Role</TableHead>
          <TableHead className="min-w-36">Login terakhir</TableHead>
          <TableHead className="w-40 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticCashiers.map((cashier) => (
          <CashierRow
            cashier={cashier}
            key={cashier.id}
            onDelete={removeCashier}
          />
        ))}
      </TableBody>
    </Table>
  );
}
