import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { createCategory } from "../actions";
import { CategoryForm } from "./category-form";

export const metadata = {
  title: "Tambah Kategori",
};

type CreateCategoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function CreateCategoryPage({
  searchParams,
}: CreateCategoryPageProps) {
  await requireOwnerProfile();

  const resolvedSearchParams = await searchParams;
  const error = getParamValue(resolvedSearchParams, "error");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <CategoryForm action={createCategory} mode="create" />
    </div>
  );
}
