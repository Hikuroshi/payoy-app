"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type UsersToastProps = {
  error?: string;
  success?: string;
};

export function UsersToast({ error, success }: UsersToastProps) {
  const shownMessage = useRef<string | null>(null);

  useEffect(() => {
    const message = success ?? error;

    if (!message || shownMessage.current === message) {
      return;
    }

    shownMessage.current = message;

    if (success) {
      toast.success(success);
      return;
    }

    toast.error(message);
  }, [error, success]);

  return null;
}
