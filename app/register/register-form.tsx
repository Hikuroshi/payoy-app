"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/auth/actions";
import { PendingButton } from "@/components/pending-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initialAuthFormState } from "@/app/auth/schema";
import { cn } from "@/lib/utils";

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const [state, formAction] = useActionState(register, initialAuthFormState);
  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const confirmPasswordError = state.errors?.confirmPassword?.[0];

  return (
    <form action={formAction} className={cn("contents", className)} {...props}>
      <Card className="w-full" key={state.submissionId}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat akun</CardTitle>
          <CardDescription>Buat akun Payoy sebagai owner bisnis.</CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="register-name">Nama lengkap</FieldLabel>
              <Input id="register-name" name="name" type="text" placeholder="Nama Owner" autoComplete="name" required aria-invalid={!!nameError} defaultValue={state.values?.name ?? ""} />
              <FieldError>{nameError}</FieldError>
            </Field>

            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input id="register-email" name="email" type="email" placeholder="owner@payoy.id" autoComplete="email" required aria-invalid={!!emailError} defaultValue={state.values?.email ?? ""} />
              <FieldError>{emailError}</FieldError>
            </Field>

            <Field data-invalid={!!passwordError}>
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <Input id="register-password" name="password" type="password" autoComplete="new-password" required aria-invalid={!!passwordError} />
              <FieldDescription>Minimal 8 karakter.</FieldDescription>
              <FieldError>{passwordError}</FieldError>
            </Field>

            <Field data-invalid={!!confirmPasswordError}>
              <FieldLabel htmlFor="register-confirm-password">Konfirmasi password</FieldLabel>
              <Input id="register-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required aria-invalid={!!confirmPasswordError} />
              <FieldError>{confirmPasswordError}</FieldError>
            </Field>

            {state.message && (
              <FieldDescription className={state.success ? "text-primary" : "text-destructive"} aria-live="polite">
                {state.message}
              </FieldDescription>
            )}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <PendingButton className="w-full" disabled={state.success} pendingText="Memproses..." type="submit">
            Daftar
          </PendingButton>
          <FieldDescription className="text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Masuk
            </Link>
          </FieldDescription>
        </CardFooter>
      </Card>
    </form>
  );
}
