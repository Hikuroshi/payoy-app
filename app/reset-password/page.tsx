import Link from "next/link";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getParamValue } from "@/lib/search";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata = {
  title: "Reset Password",
};

type ResetPasswordPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const hasLinkError = getParamValue(resolvedSearchParams, "error") === "invalid_recovery_link";

  if (hasLinkError) {
    return (
      <AuthShell>
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
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  );
}
