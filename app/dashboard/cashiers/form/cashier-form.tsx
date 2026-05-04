import Link from "next/link";

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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { DashboardCashier } from "../data";

type CashierFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  cashier?: DashboardCashier;
  mode: "create" | "edit";
};

export function CashierForm({ action, cashier, mode }: CashierFormProps) {
  const isEdit = mode === "edit";

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Cashier" : "Tambah Cashier"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Perbarui nama, email, atau password cashier."
            : "Cashier baru akan terhubung ke akun owner ini."}
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <FieldGroup>
            <input
              name="redirectTo"
              type="hidden"
              value={
                isEdit && cashier
                  ? `/dashboard/cashiers/form/${cashier.id}`
                  : "/dashboard/cashiers/form"
              }
            />
            {isEdit && cashier ? (
              <input name="id" type="hidden" value={cashier.id} />
            ) : null}
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input defaultValue={cashier?.name} id="name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                autoComplete="email"
                defaultValue={cashier?.email}
                id="email"
                name="email"
                required
                type="email"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
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
            </Field>
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
