"use client";

import Link from "next/link";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { FoodCategoryOption } from "@/app/dashboard/categories/data";
import type { Food } from "../data";
import { initialFoodFormState, type FoodFormState } from "../schema";

type FoodFormProps = {
  action: (state: FoodFormState, formData: FormData) => Promise<FoodFormState>;
  categories: FoodCategoryOption[];
  food?: Food;
  mode: "create" | "edit";
};

export function FoodForm({ action, categories, food, mode }: FoodFormProps) {
  const isEdit = mode === "edit";
  const [state, formAction] = useActionState(action, initialFoodFormState);
  const categoryError = state.errors?.category_id?.[0];
  const nameError = state.errors?.name?.[0];
  const priceError = state.errors?.price?.[0];
  const descriptionError = state.errors?.description?.[0];
  const imageError = state.errors?.image?.[0];
  const defaultCategory = state.values?.category_id ?? food?.categoryId ?? "__none";
  const defaultName = state.values?.name ?? food?.name ?? "";
  const defaultPrice = state.values?.price ?? String(food?.price ?? "");
  const defaultDescription = state.values?.description ?? food?.description ?? "";
  const defaultAvailability = state.values?.is_available ?? food?.isAvailable ?? true;

  return (
    <Card className="mx-auto w-full max-w-2xl" key={state.submissionId ?? `${mode}-${food?.id ?? "new"}`}>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Makanan" : "Tambah Makanan"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Perbarui nama, harga, deskripsi, dan status makanan."
            : "Makanan akan tampil di menu meja milik owner ini."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            {isEdit && food ? (
              <input name="id" type="hidden" value={food.id} />
            ) : null}
            <Field data-invalid={!!categoryError}>
              <FieldLabel htmlFor="category_id">Kategori</FieldLabel>
              <Select defaultValue={defaultCategory} name="category_id">
                <SelectTrigger
                  aria-invalid={!!categoryError}
                  className="w-full"
                  id="category_id"
                >
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__none">Tanpa kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>{categoryError}</FieldError>
            </Field>
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input aria-invalid={!!nameError} defaultValue={defaultName} id="name" name="name" required />
              <FieldError>{nameError}</FieldError>
            </Field>
            <Field data-invalid={!!priceError}>
              <FieldLabel htmlFor="price">Harga</FieldLabel>
              <Input
                aria-invalid={!!priceError}
                defaultValue={defaultPrice}
                id="price"
                min={0}
                name="price"
                required
                step={500}
                type="number"
              />
              <FieldError>{priceError}</FieldError>
            </Field>
            <Field data-invalid={!!descriptionError}>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                aria-invalid={!!descriptionError}
                defaultValue={defaultDescription}
                id="description"
                name="description"
                placeholder="Opsional"
              />
              <FieldError>{descriptionError}</FieldError>
            </Field>
            <Field data-invalid={!!imageError}>
              <FieldLabel htmlFor="image">Gambar</FieldLabel>
              {food?.imageUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                  <Image
                    alt={food.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    src={food.imageUrl}
                    unoptimized
                  />
                </div>
              ) : null}
              <Input accept="image/*" aria-invalid={!!imageError} id="image" name="image" type="file" />
              <FieldDescription>
                Opsional. Gunakan gambar maksimal 1 MB.
              </FieldDescription>
              <FieldError>{imageError}</FieldError>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                defaultChecked={defaultAvailability}
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
            {state.message ? (
              <FieldDescription className="text-destructive" aria-live="polite">
                {state.message}
              </FieldDescription>
            ) : null}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-5">
          <Button asChild variant="outline">
            <Link href="/dashboard/foods">Batal</Link>
          </Button>
          <PendingButton
            pendingText={isEdit ? "Menyimpan..." : "Membuat..."}
            type="submit"
          >
            {isEdit ? "Simpan perubahan" : "Buat makanan"}
          </PendingButton>
        </CardFooter>
      </form>
    </Card>
  );
}
