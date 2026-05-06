"use server";

import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { createClient } from "@/lib/server";
import {
  initialAuthFormState,
  loginSchema,
  registerSchema,
  type AuthFormState,
} from "./schema";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
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

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
