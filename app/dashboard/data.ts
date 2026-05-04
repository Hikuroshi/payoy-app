import "server-only";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import type { CurrentUserProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/server";

import {
  activeOrderStatuses,
  getRecentOrders,
  historyOrderStatuses,
  type DashboardOrder,
  type OrderStatus,
} from "./orders/data";

export type DashboardMetric = {
  description: string;
  label: string;
  value: string;
};

export type DashboardSummary = {
  metrics: DashboardMetric[];
  recentOrders: DashboardOrder[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

async function getOrderCount(
  profile: CurrentUserProfile,
  statuses?: readonly OrderStatus[]
) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  if (statuses?.length) {
    query = query.in("status", [...statuses]);
  }

  if (profile.role === "owner") {
    query = query.eq("owner_id", profile.id);
  }

  const { count } = await query;

  return count ?? 0;
}

async function getRevenue(profile: CurrentUserProfile) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("total")
    .in("status", ["paid", "processing", "done"]);

  if (profile.role === "owner") {
    query = query.eq("owner_id", profile.id);
  }

  const { data } = await query.returns<{ total: number | string }[]>();

  return (data ?? []).reduce((sum, order) => sum + Number(order.total), 0);
}

async function getOwnerResourceCount(
  profile: CurrentUserProfile,
  table: "foods" | "restaurant_tables"
) {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", {
    count: "exact",
    head: true,
  });

  if (profile.role === "owner") {
    query = query.eq("owner_id", profile.id);
  }

  if (table === "foods") {
    query = query.eq("is_available", true);
  }

  const { count } = await query;

  return count ?? 0;
}

async function getUserCount(role?: "admin" | "owner" | "cashier") {
  if (!hasSupabaseAdminConfig()) {
    return 0;
  }

  const admin = createAdminClient();
  let query = admin.from("users").select("id", { count: "exact", head: true });

  if (role) {
    query = query.eq("role", role);
  }

  const { count } = await query;

  return count ?? 0;
}

export async function getDashboardSummary(
  profile: CurrentUserProfile
): Promise<DashboardSummary> {
  const [activeOrders, historyOrders, revenue, recentOrders] =
    await Promise.all([
      getOrderCount(profile, activeOrderStatuses),
      getOrderCount(profile, historyOrderStatuses),
      getRevenue(profile),
      getRecentOrders(profile, 5),
    ]);

  if (profile.role === "admin") {
    const [users, owners, cashiers] = await Promise.all([
      getUserCount(),
      getUserCount("owner"),
      getUserCount("cashier"),
    ]);

    return {
      metrics: [
        {
          description: "Akun yang tersimpan di Supabase.",
          label: "Total User",
          value: users.toLocaleString("id-ID"),
        },
        {
          description: "User dengan role owner.",
          label: "Owner",
          value: owners.toLocaleString("id-ID"),
        },
        {
          description: "User dengan role cashier.",
          label: "Cashier",
          value: cashiers.toLocaleString("id-ID"),
        },
        {
          description: "Pesanan aktif dan history.",
          label: "Total Pesanan",
          value: (activeOrders + historyOrders).toLocaleString("id-ID"),
        },
      ],
      recentOrders,
    };
  }

  const [tables, foods] = await Promise.all([
    getOwnerResourceCount(profile, "restaurant_tables"),
    getOwnerResourceCount(profile, "foods"),
  ]);

  return {
    metrics: [
      {
        description: "Menunggu bayar, dibayar, atau diproses.",
        label: "Pesanan Aktif",
        value: activeOrders.toLocaleString("id-ID"),
      },
      {
        description: "Pesanan selesai dan dibatalkan.",
        label: "History Pesanan",
        value: historyOrders.toLocaleString("id-ID"),
      },
      {
        description: "Total dari pesanan yang sudah dibayar.",
        label: "Pendapatan",
        value: formatCurrency(revenue),
      },
      {
        description:
          profile.role === "owner"
            ? `${tables} meja dan ${foods} menu tersedia.`
            : "Meja dan menu yang bisa dilihat cashier.",
        label: profile.role === "owner" ? "Outlet" : "Menu Tersedia",
        value:
          profile.role === "owner"
            ? `${tables}/${foods}`
            : foods.toLocaleString("id-ID"),
      },
    ],
    recentOrders,
  };
}
