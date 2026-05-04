import Link from "next/link";

import { StatusToast } from "@/components/status-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { getOwnerCashiers, type DashboardCashier } from "./data";
import { DeleteCashierDialog } from "./delete-cashier-dialog";

type CashiersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CashiersTable({ cashiers }: { cashiers: DashboardCashier[] }) {
  if (!cashiers.length) {
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
        {cashiers.map((cashier) => (
          <TableRow key={cashier.id}>
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
                <DeleteCashierDialog id={cashier.id} name={cashier.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function CashiersPage({ searchParams }: CashiersPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const { cashiers, error: cashiersError } = await getOwnerCashiers(owner.id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? cashiersError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Cashier</CardTitle>
            <CardDescription>Kelola akun cashier untuk outlet owner ini.</CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/cashiers/form">Tambah cashier</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CashiersTable cashiers={cashiers} />
        </CardContent>
      </Card>
    </div>
  );
}
