"use client";

import Link from "next/link";
import * as React from "react";
import { useActionState } from "react";

import { resetPassword } from "@/app/auth/actions";
import { initialResetPasswordFormState } from "@/app/auth/schema";
import { PendingButton } from "@/components/pending-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/client";

type RecoveryStatus = "checking" | "invalid" | "ready";

function InvalidRecoveryLinkCard() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Link reset tidak valid</CardTitle>
        <CardDescription>Tautan reset password sudah kedaluwarsa atau belum berhasil diverifikasi.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Minta link reset password baru lalu buka kembali email terbaru dari Supabase.</p>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button asChild className="w-full">
          <Link href="/forgot-password">Minta link baru</Link>
        </Button>
        <Button asChild className="w-full" variant="outline">
          <Link href="/login">Kembali ke login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CheckingRecoveryCard() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Memverifikasi link reset</CardTitle>
        <CardDescription>Tunggu sebentar, kami sedang menyiapkan sesi untuk mengganti password Anda.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <Spinner className="size-5" />
      </CardContent>
    </Card>
  );
}

function sanitizeRecoveryUrl() {
  const url = new URL(window.location.href);
  const hasHash = Boolean(url.hash);

  url.hash = "";
  url.searchParams.delete("code");
  url.searchParams.delete("token_hash");
  url.searchParams.delete("type");
  url.searchParams.delete("next");

  const nextUrl = `${url.pathname}${url.search ? `?${url.searchParams.toString()}` : ""}`;

  if (hasHash || url.search) {
    window.history.replaceState({}, "", nextUrl);
  }
}

export function ResetPasswordForm() {
  const supabase = React.useMemo(() => createClient(), []);
  const [state, formAction] = useActionState(resetPassword, initialResetPasswordFormState);
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<RecoveryStatus>("checking");
  const passwordError = state.errors?.password?.[0];
  const confirmPasswordError = state.errors?.confirmPassword?.[0];

  React.useEffect(() => {
    let isMounted = true;

    const markReady = (nextEmail?: string) => {
      if (!isMounted) {
        return;
      }

      sanitizeRecoveryUrl();
      setEmail(nextEmail ?? "");
      setStatus("ready");
    };

    const markInvalid = () => {
      if (!isMounted) {
        return;
      }

      setStatus("invalid");
    };

    const resolveRecoverySession = async () => {
      const url = new URL(window.location.href);
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");

      if (tokenHash && type === "recovery") {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (!error && data.user) {
          markReady(data.user.email ?? "");
          return;
        }
      }

      const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const hashType = hashParams.get("type");

      if (accessToken && refreshToken && hashType === "recovery") {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error && data.user) {
          markReady(data.user.email ?? "");
          return;
        }
      }

      const { data, error } = await supabase.auth.getUser();

      if (!error && data.user) {
        markReady(data.user.email ?? "");
        return;
      }

      markInvalid();
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        window.setTimeout(() => {
          if (session?.user) {
            markReady(session.user.email ?? "");
          }
        }, 0);
      }
    });

    void resolveRecoverySession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (status === "checking") {
    return <CheckingRecoveryCard />;
  }

  if (status === "invalid") {
    return <InvalidRecoveryLinkCard />;
  }

  return (
    <form action={formAction}>
      <Card className="w-full" key={state.submissionId}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat password baru</CardTitle>
          <CardDescription>Ganti password untuk akun {email || "Anda"}.</CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!passwordError}>
              <FieldLabel htmlFor="reset-password">Password baru</FieldLabel>
              <Input
                aria-invalid={!!passwordError}
                autoComplete="new-password"
                id="reset-password"
                minLength={8}
                name="password"
                required
                type="password"
              />
              <FieldDescription>Minimal 8 karakter.</FieldDescription>
              <FieldError>{passwordError}</FieldError>
            </Field>

            <Field data-invalid={!!confirmPasswordError}>
              <FieldLabel htmlFor="reset-confirm-password">Konfirmasi password baru</FieldLabel>
              <Input
                aria-invalid={!!confirmPasswordError}
                autoComplete="new-password"
                id="reset-confirm-password"
                minLength={8}
                name="confirmPassword"
                required
                type="password"
              />
              <FieldError>{confirmPasswordError}</FieldError>
            </Field>

            {state.message ? (
              <FieldDescription aria-live="polite" className={state.success ? "text-primary" : "text-destructive"}>
                {state.message}
              </FieldDescription>
            ) : null}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {state.success ? (
            <Button asChild className="w-full">
              <Link href="/dashboard">Lanjut ke dashboard</Link>
            </Button>
          ) : (
            <PendingButton className="w-full" pendingText="Menyimpan..." type="submit">
              Simpan password baru
            </PendingButton>
          )}
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">Kembali ke login</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
