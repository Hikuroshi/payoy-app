"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { deleteRestaurantTable } from "./actions";

type DeleteTableDialogProps = {
  id: string;
  number: string;
};

export function DeleteTableDialog({ id, number }: DeleteTableDialogProps) {
  const formId = `delete-table-${id}`;

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
          <form action={deleteRestaurantTable} id={formId}>
            <input name="id" type="hidden" value={id} />
          </form>
          <AlertDialogAction form={formId} type="submit" variant="destructive">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
