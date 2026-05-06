"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireOrderStaffProfile } from "@/lib/auth/profile";
import type { OrderStatus } from "@/lib/order";
import { createClient } from "@/lib/server";

import { updateOrderStatusSchema } from "./schema";

const ordersPath = "/dashboard/orders";
const historyPath = "/dashboard/orders/history";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getSafeDashboardPath(path: string) {
  return path.startsWith(ordersPath) ? path : ordersPath;
}

function redirectWith(type: "success" | "error", message: string, path = ordersPath): never {
  const searchParams = new URLSearchParams({ [type]: message });
  redirect(`${path}?${searchParams.toString()}`);
}

function getStatusMessage(status: OrderStatus) {
  if (status === "processing") {
    return "Pesanan diproses.";
  }

  if (status === "done") {
    return "Pesanan selesai.";
  }

  if (status === "cancelled") {
    return "Pesanan dibatalkan.";
  }

  return "Status pesanan diperbarui.";
}

export async function updateOrderStatus(formData: FormData) {
  const profile = await requireOrderStaffProfile();
  const parsed = updateOrderStatusSchema.safeParse({
    id: getFormString(formData, "id"),
    redirectTo: getSafeDashboardPath(getFormString(formData, "redirectTo")),
    status: getFormString(formData, "status"),
  });

  if (!parsed.success) {
    redirectWith("error", "Status pesanan tidak valid.");
  }

  const now = new Date().toISOString();
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .update({
      completed_at: parsed.data.status === "done" || parsed.data.status === "cancelled" ? now : null,
      status: parsed.data.status,
      updated_at: now,
    })
    .eq("id", parsed.data.id);

  if (profile.role === "owner") {
    query = query.eq("owner_id", profile.id);
  }

  if (profile.role === "cashier") {
    if (!profile.ownerId) {
      redirectWith("error", "Cashier belum terhubung ke owner.", parsed.data.redirectTo);
    }

    query = query.eq("owner_id", profile.ownerId);
  }

  const { error } = await query;

  if (error) {
    redirectWith("error", "Status pesanan gagal diperbarui.", parsed.data.redirectTo);
  }

  revalidatePath("/dashboard");
  revalidatePath(ordersPath);
  revalidatePath(historyPath);
  redirectWith("success", getStatusMessage(parsed.data.status), parsed.data.redirectTo);
}
