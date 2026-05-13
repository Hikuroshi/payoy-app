import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
