import { headers } from "next/headers";

import { AuthShell } from "@/components/auth-shell";
import { getRequestOrigin } from "@/lib/request-origin";

import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata = {
  title: "Lupa Password",
};

export default async function ForgotPasswordPage() {
  const requestHeaders = await headers();
  const redirectTo = `${getRequestOrigin(requestHeaders)}/auth/callback?next=/reset-password`;

  return (
    <AuthShell>
      <ForgotPasswordForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
