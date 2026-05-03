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

import { deleteDashboardUser } from "./actions";

type DeleteUserDialogProps = {
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

export function DeleteUserDialog({ id, name }: DeleteUserDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus user?</AlertDialogTitle>
          <AlertDialogDescription>
            User {name} akan dihapus dari dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={deleteDashboardUser} className="contents">
            <input name="id" type="hidden" value={id} />
            <DeleteSubmitButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
