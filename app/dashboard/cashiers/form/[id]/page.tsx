import { notFound } from "next/navigation";
import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { isUuid } from "@/lib/uuid";

import { updateDashboardCashier } from "../../actions";
import { getOwnerCashier } from "../../data";
import { CashierForm } from "../cashier-form";

type EditCashierPageProps = {
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

export default async function EditCashierPage({
  params,
  searchParams,
}: EditCashierPageProps) {
  const owner = await requireOwnerProfile();
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const error = getParamValue(resolvedSearchParams, "error");

  if (!isUuid(id)) {
    notFound();
  }

  const { cashier, error: cashierError } = await getOwnerCashier(owner.id, id);

  if (!cashier) {
    if (cashierError === "Cashier tidak ditemukan.") {
      notFound();
    }

    throw new Error(cashierError ?? "Cashier gagal dimuat.");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <CashierForm
        action={updateDashboardCashier}
        cashier={cashier}
        mode="edit"
      />
    </div>
  );
}
