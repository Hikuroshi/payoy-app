import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { Food } from "../data";

type FoodFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  food?: Food;
  mode: "create" | "edit";
};

export function FoodForm({ action, food, mode }: FoodFormProps) {
  const isEdit = mode === "edit";

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Makanan" : "Tambah Makanan"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Perbarui nama, harga, deskripsi, dan status makanan."
            : "Makanan akan tampil di menu meja milik owner ini."}
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <FieldGroup>
            <input
              name="redirectTo"
              type="hidden"
              value={
                isEdit && food
                  ? `/dashboard/foods/form/${food.id}`
                  : "/dashboard/foods/form"
              }
            />
            {isEdit && food ? (
              <input name="id" type="hidden" value={food.id} />
            ) : null}
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input defaultValue={food?.name} id="name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="price">Harga</FieldLabel>
              <Input
                defaultValue={food?.price}
                id="price"
                min={0}
                name="price"
                required
                step={500}
                type="number"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                defaultValue={food?.description}
                id="description"
                name="description"
                placeholder="Opsional"
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                defaultChecked={food?.isAvailable ?? true}
                id="is_available"
                name="is_available"
              />
              <FieldContent>
                <FieldLabel htmlFor="is_available">Tersedia</FieldLabel>
                <FieldDescription>
                  Tampilkan makanan di menu pelanggan.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-5">
          <Button asChild variant="outline">
            <Link href="/dashboard/foods">Batal</Link>
          </Button>
          <Button type="submit">
            {isEdit ? "Simpan perubahan" : "Buat makanan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
