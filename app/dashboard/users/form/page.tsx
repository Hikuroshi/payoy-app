import { requireAdminProfile } from "@/lib/auth/profile";

import { createDashboardUser } from "../actions";
import { UsersToast } from "../users-toast";
import { UserForm } from "./user-form";

type CreateUserPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function CreateUserPage({ searchParams }: CreateUserPageProps) {
  await requireAdminProfile();

  const resolvedSearchParams = await searchParams;
  const error = getParamValue(resolvedSearchParams, "error");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <UsersToast error={error} />
      <UserForm action={createDashboardUser} mode="create" />
    </div>
  );
}
