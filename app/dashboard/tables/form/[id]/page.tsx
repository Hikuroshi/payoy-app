import { notFound } from "next/navigation";
import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { isUuid } from "@/lib/uuid";

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

  if (!isUuid(id)) {
    notFound();
  }

  const { table, error: tableError } = await getOwnerTable(owner.id, id);

  if (!table) {
    if (tableError === "Meja tidak ditemukan.") {
      notFound();
    }

    throw new Error(tableError ?? "Meja gagal dimuat.");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <TableForm action={updateRestaurantTable} mode="edit" table={table} />
    </div>
  );
}
