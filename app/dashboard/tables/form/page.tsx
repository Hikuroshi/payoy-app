import { requireOwnerProfile } from "@/lib/auth/profile";

import { createRestaurantTable } from "../actions";
import { StatusToast } from "@/components/status-toast";
import { TableForm } from "./table-form";

export const metadata = {
  title: "Tambah Meja",
};

type CreateTablePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function CreateTablePage({
  searchParams,
}: CreateTablePageProps) {
  await requireOwnerProfile();

  const resolvedSearchParams = await searchParams;
  const error = getParamValue(resolvedSearchParams, "error");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <TableForm action={createRestaurantTable} mode="create" />
    </div>
  );
}
