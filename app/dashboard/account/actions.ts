"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { requireUserProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";

import {
  type AccountFormState,
  type AccountFormValues,
  updateAccountSchema,
} from "./schema";

const dashboardAccountPath = "/dashboard/account";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWith(type: "success" | "error", message: string): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${dashboardAccountPath}?${searchParams.toString()}`);
}

function createAccountFormState(
  values: Partial<AccountFormValues>,
  message?: string,
  errors?: AccountFormState["errors"]
): AccountFormState {
  return {
    errors,
    message,
    submissionId: createSubmissionId(),
    values,
  };
}

function getEmailFieldError(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("exists") ||
    normalizedMessage.includes("registered")
  ) {
    return ["Email sudah digunakan."];
  }

  return undefined;
}

export async function updateOwnAccount(
  _state: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const profile = await requireUserProfile();
  const values = {
    email: getFormString(formData, "email"),
    name: getFormString(formData, "name"),
  };

  const parsed = updateAccountSchema.safeParse({
    name: values.name,
    email: values.email,
    password: getFormString(formData, "password"),
    confirmPassword: getFormString(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return createAccountFormState(
      values,
      "Periksa kembali data akun Anda.",
      parsed.error.flatten().fieldErrors
    );
  }

  if (!hasSupabaseAdminConfig()) {
    return createAccountFormState(values, "Akun gagal diperbarui.");
  }

  const supabase = await createClient();
  const { email, name, password } = parsed.data;
  const { error: authError } = await supabase.auth.updateUser({
    email,
    ...(password ? { password } : {}),
    data: {
      name,
    },
  });

  if (authError) {
    return createAccountFormState(values, "Akun gagal diperbarui.", {
      email: getEmailFieldError(authError.message),
    });
  }

  const admin = createAdminClient();
  const { error: userError } = await admin
    .from("users")
    .update({
      name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (userError) {
    return createAccountFormState(values, "Akun gagal diperbarui.");
  }

  revalidatePath("/dashboard");
  revalidatePath(dashboardAccountPath);
  redirectWith("success", "Perubahan akun berhasil disimpan.");
}
