import { notFound } from "next/navigation";

import { StatusToast } from "@/components/status-toast";
import { requireOwnerProfile } from "@/lib/auth/profile";
import { isUuid } from "@/lib/uuid";

import { updateCategory } from "../../actions";
import { getOwnerCategory } from "../../data";
import { CategoryForm } from "../category-form";

export const metadata = {
  title: "Edit Kategori",
};

type EditCategoryPageProps = {
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

export default async function EditCategoryPage({
  params,
  searchParams,
}: EditCategoryPageProps) {
  const owner = await requireOwnerProfile();
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const error = getParamValue(resolvedSearchParams, "error");

  if (!isUuid(id)) {
    notFound();
  }

  const { category, error: categoryError } = await getOwnerCategory(owner.id, id);

  if (!category) {
    if (categoryError === "Kategori tidak ditemukan.") {
      notFound();
    }

    throw new Error(categoryError ?? "Kategori gagal dimuat.");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      <CategoryForm action={updateCategory} category={category} mode="edit" />
    </div>
  );
}
