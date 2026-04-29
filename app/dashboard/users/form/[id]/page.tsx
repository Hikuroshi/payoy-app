import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminProfile } from "@/lib/auth/profile";

import { updateDashboardUser } from "../../actions";
import { getDashboardUser } from "../../data";
import { UsersToast } from "../../users-toast";
import { UserForm } from "../user-form";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
        <CardDescription>User tidak bisa dimuat.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs/relaxed text-destructive">{message}</div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href="/dashboard/users">Kembali</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function EditUserPage({ params, searchParams }: EditUserPageProps) {
  await requireAdminProfile();

  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const error = getParamValue(resolvedSearchParams, "error");
  const { user, error: userError } = await getDashboardUser(id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <UsersToast error={error} />
      {user ? <UserForm action={updateDashboardUser} mode="edit" user={user} /> : <ErrorCard message={userError ?? "User tidak ditemukan."} />}
    </div>
  );
}
