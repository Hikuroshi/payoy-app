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

import { deleteRestaurantTable } from "./actions";

type DeleteTableDialogProps = {
  action?: (formData: FormData) => void | Promise<void>;
  id: string;
  number: string;
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

export function DeleteTableDialog({
  action = deleteRestaurantTable,
  id,
  number,
}: DeleteTableDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus meja?</AlertDialogTitle>
          <AlertDialogDescription>
            Meja {number} akan dihapus dari daftar meja.
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
