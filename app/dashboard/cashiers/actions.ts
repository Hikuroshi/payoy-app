"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { requireOwnerProfile } from "@/lib/auth/profile";

const dashboardCashiersPath = "/dashboard/cashiers";

const createCashierSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

const updateCashierSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  id: z.uuid("Cashier tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  password: z
    .string()
    .refine(
      (password) => password === "" || password.length >= 8,
      "Password minimal 8 karakter."
    )
    .optional(),
});

const deleteCashierSchema = z.object({
  id: z.uuid("Cashier tidak valid."),
});

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getSafeDashboardPath(path: string) {
  return path.startsWith(dashboardCashiersPath) ? path : dashboardCashiersPath;
}

function getRedirectPath(formData: FormData) {
  return getSafeDashboardPath(getFormString(formData, "redirectTo"));
}

function redirectWith(
  type: "success" | "error",
  message: string,
  path = dashboardCashiersPath
): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function getAdminClientOrRedirect(errorPath = dashboardCashiersPath) {
  if (!hasSupabaseAdminConfig()) {
    redirectWith("error", "Cashier gagal diproses.", errorPath);
  }

  return createAdminClient();
}

async function ensureOwnerCashier(
  admin: ReturnType<typeof createAdminClient>,
  ownerId: string,
  cashierId: string,
  errorPath = dashboardCashiersPath
) {
  const { data, error } = await admin
    .from("users")
    .select("id")
    .eq("id", cashierId)
    .eq("role", "cashier")
    .eq("owner_id", ownerId)
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    redirectWith("error", "Cashier tidak ditemukan.", errorPath);
  }
}

export async function createDashboardCashier(formData: FormData) {
  const owner = await requireOwnerProfile();
  const errorPath = getRedirectPath(formData);
  const parsed = createCashierSchema.safeParse({
    email: getFormString(formData, "email"),
    name: getFormString(formData, "name"),
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data cashier tidak valid.",
      errorPath
    );
  }

  const admin = getAdminClientOrRedirect(errorPath);
  const { email, name, password } = parsed.data;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: { name },
  });

  if (error || !data.user) {
    redirectWith("error", "Cashier gagal dibuat.", errorPath);
  }

  const { error: cashierError } = await admin.from("users").upsert({
    id: data.user.id,
    name,
    owner_id: owner.id,
    role: "cashier",
    updated_at: new Date().toISOString(),
  });

  if (cashierError) {
    redirectWith("error", "Cashier gagal dibuat.", errorPath);
  }

  revalidatePath(dashboardCashiersPath);
  revalidatePath("/dashboard");
  redirectWith("success", "Cashier berhasil dibuat.");
}

export async function updateDashboardCashier(formData: FormData) {
  const owner = await requireOwnerProfile();
  const errorPath = getRedirectPath(formData);
  const parsed = updateCashierSchema.safeParse({
    email: getFormString(formData, "email"),
    id: getFormString(formData, "id"),
    name: getFormString(formData, "name"),
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Data cashier tidak valid.",
      errorPath
    );
  }

  const admin = getAdminClientOrRedirect(errorPath);
  const { email, id, name, password } = parsed.data;

  await ensureOwnerCashier(admin, owner.id, id, errorPath);

  const { error } = await admin.auth.admin.updateUserById(id, {
    email,
    ...(password ? { password } : {}),
    user_metadata: { name },
  });

  if (error) {
    redirectWith("error", "Cashier gagal diperbarui.", errorPath);
  }

  const { error: cashierError } = await admin.from("users").upsert({
    id,
    name,
    owner_id: owner.id,
    role: "cashier",
    updated_at: new Date().toISOString(),
  });

  if (cashierError) {
    redirectWith("error", "Cashier gagal diperbarui.", errorPath);
  }

  revalidatePath(dashboardCashiersPath);
  revalidatePath("/dashboard");
  redirectWith("success", "Cashier berhasil diperbarui.");
}

export async function deleteDashboardCashier(formData: FormData) {
  const owner = await requireOwnerProfile();
  const parsed = deleteCashierSchema.safeParse({
    id: getFormString(formData, "id"),
  });

  if (!parsed.success) {
    redirectWith(
      "error",
      parsed.error.issues[0]?.message ?? "Cashier tidak valid."
    );
  }

  const admin = getAdminClientOrRedirect();
  await ensureOwnerCashier(admin, owner.id, parsed.data.id);

  const { error } = await admin.auth.admin.deleteUser(parsed.data.id);

  if (error) {
    redirectWith("error", "Cashier gagal dihapus.");
  }

  revalidatePath(dashboardCashiersPath);
  revalidatePath("/dashboard");
  redirectWith("success", "Cashier berhasil dihapus.");
}
