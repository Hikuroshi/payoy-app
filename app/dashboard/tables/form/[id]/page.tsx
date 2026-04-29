import Link from "next/link";

import { StatusToast } from "@/components/status-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { updateRestaurantTable } from "../../actions";
import { getOwnerTable } from "../../data";
import { TableForm } from "../table-form";

type EditTablePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Meja</CardTitle>
        <CardDescription>Meja tidak bisa dimuat.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs/relaxed text-destructive">
          {message}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href="/dashboard/tables">Kembali</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function EditTablePage({
  params,
  searchParams,
}: EditTablePageProps) {
  const owner = await requireOwnerProfile();
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const error = getParamValue(resolvedSearchParams, "error");
  const { table, error: tableError } = await getOwnerTable(owner.id, id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      {table ? (
        <TableForm action={updateRestaurantTable} mode="edit" table={table} />
      ) : (
        <ErrorCard message={tableError ?? "Meja tidak ditemukan."} />
      )}
    </div>
  );
}
