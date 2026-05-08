"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PendingButton } from "@/components/pending-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CurrentUserProfile } from "@/lib/auth/profile";

import { roleLabels } from "../users/user-utils";
import {
  initialAccountFormState,
  type AccountFormState,
} from "./schema";

type AccountFormProps = {
  action: (
    state: AccountFormState,
    formData: FormData
  ) => Promise<AccountFormState>;
  profile: CurrentUserProfile;
};

export function AccountForm({ action, profile }: AccountFormProps) {
  const [state, formAction] = useActionState(action, initialAccountFormState);
  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const confirmPasswordError = state.errors?.confirmPassword?.[0];
  const defaultName = state.values?.name ?? profile.fullName;
  const defaultEmail = state.values?.email ?? profile.email;

  return (
    <Card
      className="mx-auto w-full max-w-2xl"
      key={state.submissionId ?? `account-${profile.id}`}
    >
      <CardHeader>
        <CardTitle>Pengaturan akun</CardTitle>
        <CardDescription>
          Perbarui nama, email, dan password akun Anda sendiri.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input
                aria-invalid={!!nameError}
                defaultValue={defaultName}
                id="name"
                name="name"
                required
              />
              <FieldError>{nameError}</FieldError>
            </Field>
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                aria-invalid={!!emailError}
                autoComplete="email"
                defaultValue={defaultEmail}
                id="email"
                name="email"
                required
                type="email"
              />
              <FieldDescription>
                Role akun Anda: {roleLabels[profile.role]}.
              </FieldDescription>
              <FieldError>{emailError}</FieldError>
            </Field>
            <Field data-invalid={!!passwordError}>
              <FieldLabel htmlFor="password">Password baru</FieldLabel>
              <Input
                aria-invalid={!!passwordError}
                autoComplete="new-password"
                id="password"
                name="password"
                placeholder="Kosongkan jika tidak diganti"
                type="password"
              />
              <FieldDescription>Minimal 8 karakter.</FieldDescription>
              <FieldError>{passwordError}</FieldError>
            </Field>
            <Field data-invalid={!!confirmPasswordError}>
              <FieldLabel htmlFor="confirmPassword">
                Konfirmasi password baru
              </FieldLabel>
              <Input
                aria-invalid={!!confirmPasswordError}
                autoComplete="new-password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Ulangi password baru"
                type="password"
              />
              <FieldError>{confirmPasswordError}</FieldError>
            </Field>
            {state.message ? (
              <FieldDescription
                aria-live="polite"
                className="text-destructive"
              >
                {state.message}
              </FieldDescription>
            ) : null}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-5">
          <Button asChild variant="outline">
            <Link href="/dashboard">Batal</Link>
          </Button>
          <PendingButton pendingText="Menyimpan..." type="submit">
            Simpan perubahan
          </PendingButton>
        </CardFooter>
      </form>
    </Card>
  );
}
