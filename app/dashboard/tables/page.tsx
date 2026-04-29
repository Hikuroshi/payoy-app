import Link from "next/link";

import { StatusToast } from "@/components/status-toast";
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

import { getOwnerTables, type RestaurantTable } from "./data";
import { DeleteTableDialog } from "./delete-table-dialog";

type TablesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function TablesList({ tables }: { tables: RestaurantTable[] }) {
  if (!tables.length) {
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
        {tables.map((table) => (
          <TableRow key={table.id}>
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
                <DeleteTableDialog id={table.id} number={table.number} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function TablesPage({ searchParams }: TablesPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const { tables, error: tablesError } = await getOwnerTables(owner.id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? tablesError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Meja</CardTitle>
            <CardDescription>
              Kelola {tables.length} meja yang akan dipakai pelanggan untuk
              membuka menu.
            </CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/tables/form">Tambah meja</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TablesList tables={tables} />
        </CardContent>
      </Card>
    </div>
  );
}
