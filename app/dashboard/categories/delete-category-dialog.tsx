"use client";

import { useFormStatus } from "react-dom";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { deleteCategory } from "./actions";

type DeleteCategoryDialogProps = {
  action?: (formData: FormData) => void | Promise<void>;
  id: string;
  name: string;
};

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant="destructive">
      {pending ? (
        <>
          <Spinner data-icon="inline-start" />
          Menghapus...
        </>
      ) : (
        "Hapus"
      )}
    </Button>
  );
}

export function DeleteCategoryDialog({
  action = deleteCategory,
  id,
  name,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
          <AlertDialogDescription>
            {name} akan dihapus. Makanan yang memakainya tetap ada, tetapi
            kategorinya akan dilepas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={action} className="contents">
            <input name="id" type="hidden" value={id} />
            <DeleteSubmitButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
