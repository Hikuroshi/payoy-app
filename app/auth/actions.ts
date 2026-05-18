"use server";

import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { createClient } from "@/lib/server";
import {
  forgotPasswordSchema,
  initialAuthFormState,
  initialForgotPasswordFormState,
  initialResetPasswordFormState,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type AuthFormState,
  type ForgotPasswordFormState,
  type ResetPasswordFormState,
} from "./schema";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getPasswordResetErrorMessage(error: { code?: string; message: string }, redirectTo: string) {
  const code = error.code?.toLowerCase() ?? "";
  const message = error.message.toLowerCase();

  if (code.includes("over_email_send_rate_limit") || message.includes("rate limit")) {
    return "Supabase membatasi pengiriman email. Layanan email bawaan biasanya hanya mengizinkan sekitar 2 email per jam.";
  }

  if (code.includes("redirect") || message.includes("redirect") || message.includes("redirect_to")) {
    return `URL redirect reset password belum diizinkan di Supabase Auth. Tambahkan ${redirectTo} ke Redirect URLs.`;
  }

  if (message.includes("smtp")) {
    return "Supabase gagal mengirim email. Periksa pengaturan Auth Email / SMTP di dashboard Supabase.";
  }

  return error.message || "Gagal mengirim link reset password.";
}

export async function login(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getFormString(formData, "email");
  const validatedFields = loginSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Periksa kembali data login Anda.",
      submissionId: createSubmissionId(),
      values: { email },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    return {
      message: "Email atau password tidak sesuai.",
      submissionId: createSubmissionId(),
      values: { email: validatedFields.data.email },
    };
  }

  redirect("/dashboard");
}

export async function register(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const submittedName = getFormString(formData, "name");
  const submittedEmail = getFormString(formData, "email");
  const validatedFields = registerSchema.safeParse({
    name: submittedName,
    email: submittedEmail,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Periksa kembali data registrasi Anda.",
      submissionId: createSubmissionId(),
      values: { name: submittedName, email: submittedEmail },
    };
  }

  const { name, email, password } = validatedFields.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return {
      message: error.message,
      submissionId: createSubmissionId(),
      values: { name, email },
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    ...initialAuthFormState,
    message: "Registrasi berhasil. Silakan cek email untuk konfirmasi akun sebelum login.",
    success: true,
  };
}

export async function requestPasswordReset(_state: ForgotPasswordFormState, formData: FormData): Promise<ForgotPasswordFormState> {
  const email = getFormString(formData, "email");
  const validatedFields = forgotPasswordSchema.safeParse({
    email,
    redirectTo: getFormString(formData, "redirectTo"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Periksa kembali email Anda.",
      submissionId: createSubmissionId(),
      values: { email },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(validatedFields.data.email, {
    redirectTo: validatedFields.data.redirectTo,
  });

  if (error) {
    console.error("Password reset request failed", {
      code: "code" in error ? error.code : undefined,
      message: error.message,
      redirectTo: validatedFields.data.redirectTo,
    });

    return {
      message: getPasswordResetErrorMessage(
        {
          code: "code" in error ? error.code : undefined,
          message: error.message,
        },
        validatedFields.data.redirectTo,
      ),
      submissionId: createSubmissionId(),
      values: { email: validatedFields.data.email },
    };
  }

  return {
    ...initialForgotPasswordFormState,
    message: "Jika email terdaftar, link reset password sudah dikirim. Silakan cek inbox email Anda.",
    success: true,
    submissionId: createSubmissionId(),
    values: { email: validatedFields.data.email },
  };
}

export async function resetPassword(_state: ResetPasswordFormState, formData: FormData): Promise<ResetPasswordFormState> {
  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Periksa kembali password baru Anda.",
      submissionId: createSubmissionId(),
    };
  }

  const supabase = await createClient();
  let error = null;

  try {
    const result = await supabase.auth.updateUser({
      password: validatedFields.data.password,
    });

    error = result.error;
  } catch {
    error = new Error("invalid_recovery_link");
  }

  if (error) {
    const normalizedMessage = error.message.toLowerCase();
    const hasInvalidRecoverySession = normalizedMessage.includes("refresh token") || normalizedMessage.includes("auth session") || normalizedMessage.includes("invalid token");

    return {
      message: error.message === "invalid_recovery_link" || hasInvalidRecoverySession ? "Tautan reset password tidak valid atau sudah kedaluwarsa." : "Password gagal diperbarui.",
      submissionId: createSubmissionId(),
    };
  }

  return {
    ...initialResetPasswordFormState,
    message: "Password berhasil diperbarui. Silakan lanjut menggunakan akun Anda.",
    success: true,
    submissionId: createSubmissionId(),
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
