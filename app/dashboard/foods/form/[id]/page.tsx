import { notFound } from "next/navigation";
import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { isUuid } from "@/lib/uuid";

import { updateFood } from "../../actions";
import { getOwnerFood } from "../../data";
import { FoodForm } from "../food-form";

export const metadata = {
  title: "Edit Makanan",
};

type EditFoodPageProps = {
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

export default async function EditFoodPage({
  params,
  searchParams,
}: EditFoodPageProps) {
  const owner = await requireOwnerProfile();
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const error = getParamValue(resolvedSearchParams, "error");

  if (!isUuid(id)) {
    notFound();
  }

  const { food, error: foodError } = await getOwnerFood(owner.id, id);

  if (!food) {
    if (foodError === "Makanan tidak ditemukan.") {
      notFound();
    }

    throw new Error(foodError ?? "Makanan gagal dimuat.");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <FoodForm action={updateFood} food={food} mode="edit" />
    </div>
  );
}
