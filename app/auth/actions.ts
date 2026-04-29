"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/server";
import type { AuthFormState } from "@/lib/auth/types";

const loginSchema = z.object({
  email: z.string().trim().email("Masukkan email yang valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter."),
    email: z.string().trim().email("Masukkan email yang valid."),
    password: z.string().min(8, "Password minimal 8 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function createSubmissionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
    success: true,
    message: "Registrasi berhasil. Silakan cek email untuk konfirmasi akun sebelum login.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
