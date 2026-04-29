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

import { deleteFood } from "./actions";

type DeleteFoodDialogProps = {
  id: string;
  name: string;
};

export function DeleteFoodDialog({ id, name }: DeleteFoodDialogProps) {
  const formId = `delete-food-${id}`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus makanan?</AlertDialogTitle>
          <AlertDialogDescription>
            {name} akan dihapus dari menu makanan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={deleteFood} id={formId}>
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
