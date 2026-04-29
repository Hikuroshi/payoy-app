import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userRoles } from "@/lib/auth/types";

import type { DashboardUser } from "../data";
import { roleLabels } from "../user-utils";

type UserFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mode: "create" | "edit";
  user?: DashboardUser;
};

export function UserForm({ action, mode, user }: UserFormProps) {
  const isEdit = mode === "edit";

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit User" : "Tambah User"}</CardTitle>
        <CardDescription>{isEdit ? "Perbarui nama, email, password, dan role user." : "User baru dibuat di Supabase Auth dan disimpan ke tabel users."}</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <FieldGroup>
            <input name="redirectTo" type="hidden" value={isEdit && user ? `/dashboard/users/form/${user.id}` : "/dashboard/users/form"} />
            {isEdit && user ? <input name="id" type="hidden" value={user.id} /> : null}
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input defaultValue={user?.name} id="name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input autoComplete="email" defaultValue={user?.email} id="email" name="email" required type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input autoComplete="new-password" id="password" minLength={8} name="password" placeholder={isEdit ? "Kosongkan jika tidak diganti" : undefined} required={!isEdit} type="password" />
              <FieldDescription>{isEdit ? "Isi hanya kalau ingin mengganti password." : "Minimal 8 karakter."}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select defaultValue={user?.role ?? "cashier"} name="role">
                <SelectTrigger className="w-full" id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {userRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-5">
          <Button asChild variant="outline">
            <Link href="/dashboard/users">Batal</Link>
          </Button>
          <Button type="submit">{isEdit ? "Simpan perubahan" : "Buat user"}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
