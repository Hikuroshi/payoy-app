import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { createDashboardCashier } from "../actions";
import { CashierForm } from "./cashier-form";

export const metadata = {
  title: "Tambah Cashier",
};

type CreateCashierPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function CreateCashierPage({
  searchParams,
}: CreateCashierPageProps) {
  await requireOwnerProfile();

  const resolvedSearchParams = await searchParams;
  const error = getParamValue(resolvedSearchParams, "error");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <CashierForm action={createDashboardCashier} mode="create" />
    </div>
  );
}
