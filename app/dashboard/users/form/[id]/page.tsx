import { notFound } from "next/navigation";
import { requireAdminProfile } from "@/lib/auth/profile";
import { isUuid } from "@/lib/uuid";

import { updateDashboardUser } from "../../actions";
import { getDashboardUser } from "../../data";
import { UsersToast } from "../../users-toast";
import { UserForm } from "../user-form";

export const metadata = {
  title: "Edit Pengguna",
};

type EditUserPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function EditUserPage({ params, searchParams }: EditUserPageProps) {
  await requireAdminProfile();

  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const error = getParamValue(resolvedSearchParams, "error");

  if (!isUuid(id)) {
    notFound();
  }

  const { user, error: userError } = await getDashboardUser(id);

  if (!user) {
    if (userError === "User tidak ditemukan.") {
      notFound();
    }

    throw new Error(userError ?? "User gagal dimuat.");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <UsersToast error={error} />
      <UserForm action={updateDashboardUser} mode="edit" user={user} />
    </div>
  );
}
