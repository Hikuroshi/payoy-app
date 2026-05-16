"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PendingButton } from "@/components/pending-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { FoodCategory } from "../data";
import { initialCategoryFormState, type CategoryFormState } from "../schema";

type CategoryFormProps = {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  category?: FoodCategory;
  mode: "create" | "edit";
};

export function CategoryForm({ action, category, mode }: CategoryFormProps) {
  const isEdit = mode === "edit";
  const [state, formAction] = useActionState(action, initialCategoryFormState);
  const nameError = state.errors?.name?.[0];
  const defaultName = state.values?.name ?? category?.name ?? "";

  return (
    <Card className="mx-auto w-full max-w-2xl" key={state.submissionId ?? `${mode}-${category?.id ?? "new"}`}>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Kategori" : "Tambah Kategori"}</CardTitle>
        <CardDescription>{isEdit ? "Perbarui nama kategori menu." : "Kategori membantu owner mengelompokkan menu."}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            {isEdit && category ? <input name="id" type="hidden" value={category.id} /> : null}
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input aria-invalid={!!nameError} defaultValue={defaultName} id="name" name="name" required />
              <FieldDescription>Contoh: Minuman, Makanan, Dessert.</FieldDescription>
              <FieldError>{nameError}</FieldError>
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
            <Link href="/dashboard/categories">Batal</Link>
          </Button>
          <PendingButton pendingText={isEdit ? "Menyimpan..." : "Membuat..."} type="submit">
            {isEdit ? "Simpan perubahan" : "Buat kategori"}
          </PendingButton>
        </CardFooter>
      </form>
    </Card>
  );
}
