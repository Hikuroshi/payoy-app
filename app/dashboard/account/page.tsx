import { StatusToast } from "@/components/status-toast";
import { requireUserProfile } from "@/lib/auth/profile";

import { updateOwnAccount } from "./actions";
import { AccountForm } from "./account-form";

export const metadata = {
  title: "Akun",
};

type AccountPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const profile = await requireUserProfile();
  const resolvedSearchParams = await searchParams;
  const error = getParamValue(resolvedSearchParams, "error");
  const success = getParamValue(resolvedSearchParams, "success");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} success={success} />
      <AccountForm action={updateOwnAccount} profile={profile} />
    </div>
  );
}
