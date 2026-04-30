"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type PendingButtonProps = React.ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function PendingButton({
  children,
  disabled,
  pendingText = "Menyimpan",
  ...props
}: PendingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || disabled} {...props}>
      {pending ? (
        <>
          <Spinner data-icon="inline-start" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
