"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset } from "@/app/auth/actions";
import { initialForgotPasswordFormState } from "@/app/auth/schema";
import { PendingButton } from "@/components/pending-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState(requestPasswordReset, initialForgotPasswordFormState);
  const emailError = state.errors?.email?.[0];

  return (
    <form action={formAction}>
      <Card className="w-full" key={state.submissionId}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Lupa password</CardTitle>
          <CardDescription>Masukkan email akun Anda. Kami akan kirim link untuk mengganti password.</CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <input name="redirectTo" type="hidden" value={redirectTo} />

            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
              <Input
                aria-invalid={!!emailError}
                autoComplete="email"
                defaultValue={state.values?.email ?? ""}
                id="forgot-email"
                name="email"
                placeholder="owner@payoy.id"
                required
                type="email"
              />
              <FieldError>{emailError}</FieldError>
            </Field>

            {state.message ? (
              <FieldDescription aria-live="polite" className={state.success ? "text-primary" : "text-destructive"}>
                {state.message}
              </FieldDescription>
            ) : null}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <PendingButton className="w-full" pendingText="Mengirim..." type="submit">
            Kirim link reset
          </PendingButton>
          <FieldDescription className="text-center">
            <Link href="/login" className="underline underline-offset-4">
              Kembali ke login
            </Link>
          </FieldDescription>
        </CardFooter>
      </Card>
    </form>
  );
}
