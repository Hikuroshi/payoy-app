"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initialAuthFormState } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [state, formAction, pending] = useActionState(login, initialAuthFormState);
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];

  return (
    <form action={formAction} className={cn("contents", className)} {...props}>
      <Card className="w-full" key={state.submissionId}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk ke akun</CardTitle>
          <CardDescription>Gunakan email dan password yang sudah terdaftar.</CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input id="login-email" name="email" type="email" placeholder="owner@payoy.id" autoComplete="email" required aria-invalid={!!emailError} defaultValue={state.values?.email ?? ""} />
              <FieldError>{emailError}</FieldError>
            </Field>

            <Field data-invalid={!!passwordError}>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Link href="#" className="ml-auto text-xs underline-offset-4 hover:underline">
                  Lupa password?
                </Link>
              </div>
              <Input id="login-password" name="password" type="password" autoComplete="current-password" required aria-invalid={!!passwordError} />
              <FieldError>{passwordError}</FieldError>
            </Field>

            {state.message && !state.errors && (
              <FieldDescription className="text-destructive" aria-live="polite">
                {state.message}
              </FieldDescription>
            )}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Memproses..." : "Masuk"}
          </Button>
          <FieldDescription className="text-center">
            Belum punya akun?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Daftar sebagai owner
            </Link>
          </FieldDescription>
        </CardFooter>
      </Card>
    </form>
  );
}
