import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminProfile } from "@/lib/auth/profile";

import { getDashboardUsers, type DashboardUser } from "./data";
import { DeleteUserDialog } from "./delete-user-dialog";
import { formatDate, getRoleBadgeVariant, roleLabels } from "./user-utils";
import { UsersToast } from "./users-toast";

type UsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function UsersTable({ users }: { users: DashboardUser[] }) {
  if (!users.length) {
    return <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">Belum ada user.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-52">User</TableHead>
          <TableHead className="min-w-48">Email</TableHead>
          <TableHead className="min-w-32">Role</TableHead>
          <TableHead className="min-w-36">Login terakhir</TableHead>
          <TableHead className="w-40 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex min-w-48 flex-col gap-1">
                <span className="font-medium">{user.name}</span>
                <span className="text-[0.625rem] text-muted-foreground">Dibuat {formatDate(user.createdAt)}</span>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)}>{roleLabels[user.role]}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDate(user.lastSignInAt)}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/users/form/${user.id}`}>Edit</Link>
                </Button>
                <DeleteUserDialog id={user.id} name={user.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requireAdminProfile();

  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const { users, error: usersError } = await getDashboardUsers();

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
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
