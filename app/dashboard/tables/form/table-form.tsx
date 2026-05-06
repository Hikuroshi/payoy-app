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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { RestaurantTable } from "../data";
import { initialTableFormState, type TableFormState } from "../schema";

type TableFormProps = {
  action: (state: TableFormState, formData: FormData) => Promise<TableFormState>;
  mode: "create" | "edit";
  table?: RestaurantTable;
};

export function TableForm({ action, mode, table }: TableFormProps) {
  const isEdit = mode === "edit";
  const [state, formAction] = useActionState(action, initialTableFormState);
  const numberError = state.errors?.number?.[0];
  const defaultNumber = state.values?.number ?? table?.number ?? "";

  return (
    <Card className="mx-auto w-full max-w-2xl" key={state.submissionId ?? `${mode}-${table?.id ?? "new"}`}>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Meja" : "Tambah Meja"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Perbarui nomor meja."
            : "Nomor meja dibuat unik untuk owner yang sedang login."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            {isEdit && table ? (
              <input name="id" type="hidden" value={table.id} />
            ) : null}
            <Field data-invalid={!!numberError}>
              <FieldLabel htmlFor="number">Nomor meja</FieldLabel>
              <Input
                aria-invalid={!!numberError}
                defaultValue={defaultNumber}
                id="number"
                name="number"
                placeholder="01"
                required
              />
              <FieldError>{numberError}</FieldError>
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
            <Link href="/dashboard/tables">Batal</Link>
          </Button>
          <PendingButton
            pendingText={isEdit ? "Menyimpan..." : "Membuat..."}
            type="submit"
          >
            {isEdit ? "Simpan perubahan" : "Buat meja"}
          </PendingButton>
        </CardFooter>
      </form>
    </Card>
  );
}
