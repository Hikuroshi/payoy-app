"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { requireAdminProfile } from "@/lib/auth/profile";
import { userRoles } from "@/lib/auth/types";

const dashboardUsersPath = "/dashboard/users";

const createUserSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  role: z.enum(userRoles),
});

const updateUserSchema = z.object({
  id: z.uuid("User tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Email tidak valid."),
  password: z
    .string()
    .refine((password) => password === "" || password.length >= 8, "Password minimal 8 karakter.")
    .optional(),
  role: z.enum(userRoles),
});

const deleteUserSchema = z.object({
  id: z.uuid("User tidak valid."),
});

function getSafeDashboardPath(path: string) {
  return path.startsWith("/dashboard/users") ? path : dashboardUsersPath;
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getRedirectPath(formData: FormData) {
  return getSafeDashboardPath(getFormString(formData, "redirectTo"));
}

function redirectWith(
  type: "success" | "error",
  message: string,
  path = dashboardUsersPath
): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function getAdminClientOrRedirect(errorPath = dashboardUsersPath) {
  if (!hasSupabaseAdminConfig()) {
    redirectWith(
      "error",
      "User gagal diproses.",
      errorPath
    );
  }

  return createAdminClient();
}

export async function createDashboardUser(formData: FormData) {
  await requireAdminProfile();
  const errorPath = getRedirectPath(formData);

  const parsed = createUserSchema.safeParse({
    name: getFormString(formData, "name"),
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
    role: getFormString(formData, "role"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data user tidak valid.",
      errorPath
    );
  }

  const admin = getAdminClientOrRedirect(errorPath);
  const { name, email, password, role } = parsed.data;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error || !data.user) {
    redirectWith("error", "User gagal dibuat.", errorPath);
  }

  const { error: userError } = await admin.from("users").upsert({
    id: data.user.id,
    name,
    role,
    updated_at: new Date().toISOString(),
  });

  if (userError) {
    redirectWith("error", "User gagal dibuat.", errorPath);
  }

  revalidatePath(dashboardUsersPath);
  redirectWith("success", "User berhasil dibuat.");
}

export async function updateDashboardUser(formData: FormData) {
  await requireAdminProfile();
  const errorPath = getRedirectPath(formData);

  const parsed = updateUserSchema.safeParse({
    id: getFormString(formData, "id"),
    name: getFormString(formData, "name"),
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
    role: getFormString(formData, "role"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data user tidak valid.",
      errorPath
    );
  }

  const admin = getAdminClientOrRedirect(errorPath);
  const { id, name, email, password, role } = parsed.data;
  const { error } = await admin.auth.admin.updateUserById(id, {
    email,
    ...(password ? { password } : {}),
    user_metadata: { name },
  });

  if (error) {
    redirectWith("error", "User gagal diperbarui.", errorPath);
  }

  const { error: userError } = await admin.from("users").upsert({
    id,
    name,
    role,
    updated_at: new Date().toISOString(),
  });

  if (userError) {
    redirectWith("error", "User gagal diperbarui.", errorPath);
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
