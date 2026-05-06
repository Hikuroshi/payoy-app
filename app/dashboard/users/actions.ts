"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { requireAdminProfile } from "@/lib/auth/profile";
import {
  createUserSchema,
  deleteUserSchema,
  type UserFormState,
  type UserFormValues,
  updateUserSchema,
} from "./schema";

const dashboardUsersPath = "/dashboard/users";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWith(type: "success" | "error", message: string, path = dashboardUsersPath): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function createUserFormState(
  values: Partial<UserFormValues>,
  message?: string,
  errors?: UserFormState["errors"]
): UserFormState {
  return {
    errors,
    message,
    submissionId: createSubmissionId(),
    values,
  };
}

function getUserErrorState(values: Partial<UserFormValues>, message: string) {
  return createUserFormState(values, message);
}

function getAdminClientOrState(values: Partial<UserFormValues>) {
  if (!hasSupabaseAdminConfig()) {
    return { state: getUserErrorState(values, "User gagal diproses.") };
  }

  return { client: createAdminClient() };
}

function getAdminClientOrRedirect(errorPath = dashboardUsersPath) {
  if (!hasSupabaseAdminConfig()) {
    redirectWith("error", "User gagal diproses.", errorPath);
  }

  return createAdminClient();
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

export async function createDashboardUser(
  _state: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdminProfile();

  const values = {
    email: getFormString(formData, "email"),
    name: getFormString(formData, "name"),
    role: getFormString(formData, "role") as UserFormValues["role"],
  };

  const parsed = createUserSchema.safeParse({
    name: values.name,
    email: values.email,
    password: getFormString(formData, "password"),
    role: values.role,
  });

  if (!parsed.success) {
    return createUserFormState(
      values,
      "Periksa kembali data user.",
      parsed.error.flatten().fieldErrors
    );
  }

  const adminResult = getAdminClientOrState(values);

  if (adminResult.state) {
    return adminResult.state;
  }

  const admin = adminResult.client;
  const { name, email, password, role } = parsed.data;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error || !data.user) {
    return createUserFormState(
      { email, name, role },
      "User gagal dibuat.",
      { email: getEmailFieldError(error?.message) }
    );
  }

  const { error: userError } = await admin.from("users").upsert({
    id: data.user.id,
    name,
    role,
    updated_at: new Date().toISOString(),
  });

  if (userError) {
    return getUserErrorState({ email, name, role }, "User gagal dibuat.");
  }

  revalidatePath(dashboardUsersPath);
  redirectWith("success", "User berhasil dibuat.");
}

export async function updateDashboardUser(
  _state: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdminProfile();

  const values = {
    email: getFormString(formData, "email"),
    name: getFormString(formData, "name"),
    role: getFormString(formData, "role") as UserFormValues["role"],
  };

  const parsed = updateUserSchema.safeParse({
    id: getFormString(formData, "id"),
    name: values.name,
    email: values.email,
    password: getFormString(formData, "password"),
    role: values.role,
  });

  if (!parsed.success) {
    return createUserFormState(
      values,
      "Periksa kembali data user.",
      parsed.error.flatten().fieldErrors
    );
  }

  const adminResult = getAdminClientOrState(values);

  if (adminResult.state) {
    return adminResult.state;
  }

  const admin = adminResult.client;
  const { id, name, email, password, role } = parsed.data;
  const { error } = await admin.auth.admin.updateUserById(id, {
    email,
    ...(password ? { password } : {}),
    user_metadata: { name },
  });

  if (error) {
    return createUserFormState(
      { email, name, role },
      "User gagal diperbarui.",
      { email: getEmailFieldError(error.message) }
    );
  }

  const { error: userError } = await admin.from("users").upsert({
    id,
    name,
    role,
    updated_at: new Date().toISOString(),
  });

  if (userError) {
    return getUserErrorState(
      { email, name, role },
      "User gagal diperbarui."
    );
  }

  revalidatePath(dashboardUsersPath);
  redirectWith("success", "User berhasil diperbarui.");
}

export async function deleteDashboardUser(formData: FormData) {
  const adminProfile = await requireAdminProfile();

  const parsed = deleteUserSchema.safeParse({
    id: getFormString(formData, "id"),
  });

  if (!parsed.success) {
    redirectWith("error", parsed.error.issues[0]?.message ?? "User tidak valid.");
  }

  if (parsed.data.id === adminProfile.id) {
    redirectWith("error", "Admin tidak bisa menghapus akun sendiri.");
  }

  const admin = getAdminClientOrRedirect();
  const { error } = await admin.auth.admin.deleteUser(parsed.data.id);

  if (error) {
    redirectWith("error", "User gagal dihapus.");
  }

  revalidatePath(dashboardUsersPath);
  redirectWith("success", "User berhasil dihapus.");
}
