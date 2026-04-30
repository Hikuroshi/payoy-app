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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { RestaurantTable } from "../data";

type TableFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mode: "create" | "edit";
  table?: RestaurantTable;
};

export function TableForm({ action, mode, table }: TableFormProps) {
  const isEdit = mode === "edit";

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Meja" : "Tambah Meja"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Perbarui nomor meja."
            : "Nomor meja dibuat unik untuk owner yang sedang login."}
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <FieldGroup>
            <input
              name="redirectTo"
              type="hidden"
              value={
                isEdit && table
                  ? `/dashboard/tables/form/${table.id}`
                  : "/dashboard/tables/form"
              }
            />
            {isEdit && table ? (
              <input name="id" type="hidden" value={table.id} />
            ) : null}
            <Field>
              <FieldLabel htmlFor="number">Nomor meja</FieldLabel>
              <Input
                defaultValue={table?.number}
                id="number"
                name="number"
                placeholder="01"
                required
              />
            </Field>
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
