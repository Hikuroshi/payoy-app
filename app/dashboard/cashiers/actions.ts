"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSubmissionId } from "@/lib/action-form";
import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { requireOwnerProfile } from "@/lib/auth/profile";
import {
  createCashierSchema,
  deleteCashierSchema,
  type CashierFormState,
  type CashierFormValues,
  updateCashierSchema,
} from "./schema";

const dashboardCashiersPath = "/dashboard/cashiers";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWith(type: "success" | "error", message: string, path = dashboardCashiersPath): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function createCashierFormState(
  values: Partial<CashierFormValues>,
  message?: string,
  errors?: CashierFormState["errors"]
): CashierFormState {
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

function getAdminClientOrState(values: Partial<CashierFormValues>) {
  if (!hasSupabaseAdminConfig()) {
    return {
      state: createCashierFormState(values, "Cashier gagal diproses."),
    };
  }

  return { client: createAdminClient() };
}

function getAdminClientOrRedirect(errorPath = dashboardCashiersPath) {
  if (!hasSupabaseAdminConfig()) {
    redirectWith("error", "Cashier gagal diproses.", errorPath);
  }

  return createAdminClient();
}

async function ensureOwnerCashier(admin: ReturnType<typeof createAdminClient>, ownerId: string, cashierId: string, errorPath = dashboardCashiersPath) {
  const { data, error } = await admin.from("users").select("id").eq("id", cashierId).eq("role", "cashier").eq("owner_id", ownerId).maybeSingle<{ id: string }>();

  if (error || !data) {
    redirectWith("error", "Cashier tidak ditemukan.", errorPath);
  }
}

export async function createDashboardCashier(
  _state: CashierFormState,
  formData: FormData
): Promise<CashierFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    email: getFormString(formData, "email"),
    name: getFormString(formData, "name"),
  };
  const parsed = createCashierSchema.safeParse({
    email: values.email,
    name: values.name,
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return createCashierFormState(
      values,
      "Periksa kembali data cashier.",
      parsed.error.flatten().fieldErrors
    );
  }

  const adminResult = getAdminClientOrState(values);

  if (adminResult.state) {
    return adminResult.state;
  }

  const admin = adminResult.client;
  const { email, name, password } = parsed.data;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: { name },
  });

  if (error || !data.user) {
    return createCashierFormState(
      { email, name },
      "Cashier gagal dibuat.",
      { email: getEmailFieldError(error?.message) }
    );
  }

  const { error: cashierError } = await admin.from("users").upsert({
    id: data.user.id,
    name,
    owner_id: owner.id,
    role: "cashier",
    updated_at: new Date().toISOString(),
  });

  if (cashierError) {
    return createCashierFormState({ email, name }, "Cashier gagal dibuat.");
  }

  revalidatePath(dashboardCashiersPath);
  revalidatePath("/dashboard");
  redirectWith("success", "Cashier berhasil dibuat.");
}

export async function updateDashboardCashier(
  _state: CashierFormState,
  formData: FormData
): Promise<CashierFormState> {
  const owner = await requireOwnerProfile();
  const values = {
    email: getFormString(formData, "email"),
    name: getFormString(formData, "name"),
  };
  const parsed = updateCashierSchema.safeParse({
    email: values.email,
    id: getFormString(formData, "id"),
    name: values.name,
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return createCashierFormState(
      values,
      "Periksa kembali data cashier.",
      parsed.error.flatten().fieldErrors
    );
  }

  const adminResult = getAdminClientOrState(values);

  if (adminResult.state) {
    return adminResult.state;
  }

  const admin = adminResult.client;
  const { email, id, name, password } = parsed.data;

  await ensureOwnerCashier(admin, owner.id, id);

  const { error } = await admin.auth.admin.updateUserById(id, {
    email,
    ...(password ? { password } : {}),
    user_metadata: { name },
  });

  if (error) {
    return createCashierFormState(
      { email, name },
      "Cashier gagal diperbarui.",
      { email: getEmailFieldError(error.message) }
    );
  }

  const { error: cashierError } = await admin.from("users").upsert({
    id,
    name,
    owner_id: owner.id,
    role: "cashier",
    updated_at: new Date().toISOString(),
  });

  if (cashierError) {
    return createCashierFormState(
      { email, name },
      "Cashier gagal diperbarui."
    );
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
    redirectWith("error", parsed.error.issues[0]?.message ?? "Cashier tidak valid.");
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
