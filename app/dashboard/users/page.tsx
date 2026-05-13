import Link from "next/link";
import { Suspense } from "react";

import { UrlSearchInput } from "@/components/url-search-input";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getParamValue, normalizeSearchQuery } from "@/lib/search";
import { requireAdminProfile } from "@/lib/auth/profile";

import { getDashboardUsers } from "./data";
import { UsersTable } from "./users-table";
import { UsersToast } from "./users-toast";

export const metadata = {
  title: "Pengguna",
};

type UsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requireAdminProfile();

  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const query = normalizeSearchQuery(getParamValue(resolvedSearchParams, "query"));
  const { users, error: usersError } = await getDashboardUsers(query);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <UsersToast error={error ?? usersError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data User</CardTitle>
            <CardDescription>Kelola akun dashboard dengan role admin, owner, dan cashier.</CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/users/form">Tambah user</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense fallback={null}>
            <UrlSearchInput placeholder="Cari user, email, atau role..." />
          </Suspense>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
