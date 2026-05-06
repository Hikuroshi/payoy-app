"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PendingButton } from "@/components/pending-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { DashboardCashier } from "../data";
import { initialCashierFormState, type CashierFormState } from "../schema";

type CashierFormProps = {
  action: (
    state: CashierFormState,
    formData: FormData
  ) => Promise<CashierFormState>;
  cashier?: DashboardCashier;
  mode: "create" | "edit";
};

export function CashierForm({ action, cashier, mode }: CashierFormProps) {
  const isEdit = mode === "edit";
  const [state, formAction] = useActionState(action, initialCashierFormState);
  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const defaultName = state.values?.name ?? cashier?.name ?? "";
  const defaultEmail = state.values?.email ?? cashier?.email ?? "";

  return (
    <Card className="mx-auto w-full max-w-2xl" key={state.submissionId ?? `${mode}-${cashier?.id ?? "new"}`}>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Cashier" : "Tambah Cashier"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Perbarui nama, email, atau password cashier."
            : "Cashier baru akan terhubung ke akun owner ini."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            {isEdit && cashier ? (
              <input name="id" type="hidden" value={cashier.id} />
            ) : null}
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input aria-invalid={!!nameError} defaultValue={defaultName} id="name" name="name" required />
              <FieldError>{nameError}</FieldError>
            </Field>
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                aria-invalid={!!emailError}
                autoComplete="email"
                defaultValue={defaultEmail}
                id="email"
                name="email"
                required
                type="email"
              />
              <FieldError>{emailError}</FieldError>
            </Field>
            <Field data-invalid={!!passwordError}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                aria-invalid={!!passwordError}
                autoComplete="new-password"
                id="password"
                minLength={8}
                name="password"
                placeholder={isEdit ? "Kosongkan jika tidak diganti" : undefined}
                required={!isEdit}
                type="password"
              />
              <FieldDescription>
                {isEdit ? "Isi hanya kalau ingin mengganti password." : "Minimal 8 karakter."}
              </FieldDescription>
              <FieldError>{passwordError}</FieldError>
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
            <Link href="/dashboard/cashiers">Batal</Link>
          </Button>
          <PendingButton
            pendingText={isEdit ? "Menyimpan..." : "Membuat..."}
            type="submit"
          >
            {isEdit ? "Simpan perubahan" : "Buat cashier"}
          </PendingButton>
        </CardFooter>
      </form>
    </Card>
  );
}
