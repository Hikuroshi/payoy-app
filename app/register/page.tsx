import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
