"use client";

import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteDashboardUser } from "./actions";
import type { DashboardUser } from "./data";
import { DeleteUserDialog } from "./delete-user-dialog";
import { formatDate, getRoleBadgeVariant, roleLabels } from "./user-utils";

function UserRow({
  onDelete,
  user,
}: {
  onDelete: (id: string) => void;
  user: DashboardUser;
}) {
  async function optimisticDelete(formData: FormData) {
    React.startTransition(() => {
      onDelete(user.id);
    });
    await deleteDashboardUser(formData);
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-48 flex-col gap-1">
          <span className="font-medium">{user.name}</span>
          <span className="text-[0.625rem] text-muted-foreground">
            Dibuat {formatDate(user.createdAt)}
          </span>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {roleLabels[user.role]}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(user.lastSignInAt)}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/users/form/${user.id}`}>Edit</Link>
          </Button>
          <DeleteUserDialog
            action={optimisticDelete}
            id={user.id}
            name={user.name}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function UsersTable({ users }: { users: DashboardUser[] }) {
  const [optimisticUsers, removeUser] = React.useOptimistic(
    users,
    (currentUsers: DashboardUser[], deletedId: string) =>
      currentUsers.filter((user) => user.id !== deletedId)
  );

  if (!optimisticUsers.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">
        Belum ada user.
      </div>
    );
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
        {optimisticUsers.map((user) => (
          <UserRow key={user.id} onDelete={removeUser} user={user} />
        ))}
      </TableBody>
    </Table>
  );
}
