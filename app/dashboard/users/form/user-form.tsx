"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PendingButton } from "@/components/pending-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userRoles } from "@/lib/auth/types";

import type { DashboardUser } from "../data";
import { initialUserFormState, type UserFormState } from "../schema";
import { roleLabels } from "../user-utils";

type UserFormProps = {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  mode: "create" | "edit";
  user?: DashboardUser;
};

export function UserForm({ action, mode, user }: UserFormProps) {
  const isEdit = mode === "edit";
  const [state, formAction] = useActionState(action, initialUserFormState);
  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const roleError = state.errors?.role?.[0];
  const defaultName = state.values?.name ?? user?.name ?? "";
  const defaultEmail = state.values?.email ?? user?.email ?? "";
  const defaultRole = state.values?.role ?? user?.role ?? "cashier";

  return (
    <Card className="mx-auto w-full max-w-2xl" key={state.submissionId ?? `${mode}-${user?.id ?? "new"}`}>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit User" : "Tambah User"}</CardTitle>
        <CardDescription>{isEdit ? "Perbarui nama, email, password, dan role user." : "User baru dibuat di Supabase Auth dan disimpan ke tabel users."}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            {isEdit && user ? <input name="id" type="hidden" value={user.id} /> : null}
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input aria-invalid={!!nameError} defaultValue={defaultName} id="name" name="name" required />
              <FieldError>{nameError}</FieldError>
            </Field>
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input aria-invalid={!!emailError} autoComplete="email" defaultValue={defaultEmail} id="email" name="email" required type="email" />
              <FieldError>{emailError}</FieldError>
            </Field>
            <Field data-invalid={!!passwordError}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input aria-invalid={!!passwordError} autoComplete="new-password" id="password" minLength={8} name="password" placeholder={isEdit ? "Kosongkan jika tidak diganti" : undefined} required={!isEdit} type="password" />
              <FieldDescription>{isEdit ? "Isi hanya kalau ingin mengganti password." : "Minimal 8 karakter."}</FieldDescription>
              <FieldError>{passwordError}</FieldError>
            </Field>
            <Field data-invalid={!!roleError}>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select defaultValue={defaultRole} name="role">
                <SelectTrigger aria-invalid={!!roleError} className="w-full" id="role">
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
              <FieldError>{roleError}</FieldError>
            </Field>
            {state.message ? (
              <FieldDescription className="text-destructive" aria-live="polite">
                {state.message}
              </FieldDescription>
            ) : null}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-5">
          <Button asChild variant="outline">
            <Link href="/dashboard/users">Batal</Link>
          </Button>
          <PendingButton
            pendingText={isEdit ? "Menyimpan..." : "Membuat..."}
            type="submit"
          >
            {isEdit ? "Simpan perubahan" : "Buat user"}
          </PendingButton>
        </CardFooter>
      </form>
    </Card>
  );
}
