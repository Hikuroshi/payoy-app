import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { createFood } from "../actions";
import { FoodForm } from "./food-form";

type CreateFoodPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function CreateFoodPage({
  searchParams,
}: CreateFoodPageProps) {
  await requireOwnerProfile();

  const resolvedSearchParams = await searchParams;
  const error = getParamValue(resolvedSearchParams, "error");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <FoodForm action={createFood} mode="create" />
    </div>
  );
}
