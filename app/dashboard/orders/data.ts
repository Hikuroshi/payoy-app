import "server-only";

import type { CurrentUserProfile } from "@/lib/auth/profile";
import {
  activeOrderStatuses,
  historyOrderStatuses,
  type OrderStatus,
} from "@/lib/order";
import { matchesSearch, normalizeSearchQuery } from "@/lib/search";
import { createClient } from "@/lib/server";

export type DashboardOrderItem = {
  id: string;
  foodName: string;
  note: string;
  price: number;
  quantity: number;
};

export type DashboardOrder = {
  id: string;
  code: string;
  tableNumber: string;
  paymentMethod: string;
  status: OrderStatus;
  subtotal: number;
  adminFee: number;
  tax: number;
  total: number;
  paidAt: string | null;
  completedAt: string | null;
  createdAt: string;
  items: DashboardOrderItem[];
};

export type { OrderStatus };

type OrderItemRow = {
  id: string;
  food_name: string;
  note: string | null;
  price: number | string;
  quantity: number;
};

type OrderRow = {
  id: string;
  code: string;
  table_number: string;
  payment_method: string;
  status: OrderStatus;
  subtotal: number | string;
  admin_fee: number | string;
  tax: number | string;
  total: number | string;
  paid_at: string | null;
  completed_at: string | null;
  created_at: string;
  order_items: OrderItemRow[] | null;
};

function mapOrder(order: OrderRow): DashboardOrder {
  return {
    adminFee: Number(order.admin_fee),
    code: order.code,
    completedAt: order.completed_at,
    createdAt: order.created_at,
    id: order.id,
    items: (order.order_items ?? []).map((item) => ({
      foodName: item.food_name,
      id: item.id,
      note: item.note ?? "",
      price: Number(item.price),
      quantity: item.quantity,
    })),
    paidAt: order.paid_at,
    paymentMethod: order.payment_method,
    status: order.status,
    subtotal: Number(order.subtotal),
    tableNumber: order.table_number,
    tax: Number(order.tax),
    total: Number(order.total),
  };
}

export async function getDashboardOrders(
  profile: CurrentUserProfile,
  mode: "active" | "history",
  query?: string
): Promise<{ error?: string; orders: DashboardOrder[] }> {
  const supabase = await createClient();
  const statuses = mode === "active" ? activeOrderStatuses : historyOrderStatuses;
  let request = supabase
    .from("orders")
    .select(
      "id, code, table_number, payment_method, status, subtotal, admin_fee, tax, total, paid_at, completed_at, created_at, order_items(id, food_name, note, price, quantity)"
    )
    .in("status", [...statuses])
    .order("created_at", { ascending: false });

  if (profile.role === "owner") {
    request = request.eq("owner_id", profile.id);
  }

  if (profile.role === "cashier") {
    if (!profile.ownerId) {
      return { orders: [] };
    }

    request = request.eq("owner_id", profile.ownerId);
  }

  const { data, error } = await request.returns<OrderRow[]>();

  if (error) {
    return { error: "Pesanan gagal dimuat.", orders: [] };
  }

  const normalizedQuery = normalizeSearchQuery(query);
  const orders = (data ?? [])
    .map(mapOrder)
    .filter((order) =>
      matchesSearch(
        normalizedQuery,
        order.code,
        order.tableNumber,
        order.paymentMethod,
        order.status,
        ...order.items.map((item) => item.foodName)
      )
    );

  return { orders };
}

export async function getRecentOrders(
  profile: CurrentUserProfile,
  limit = 5
): Promise<DashboardOrder[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(
      "id, code, table_number, payment_method, status, subtotal, admin_fee, tax, total, paid_at, completed_at, created_at, order_items(id, food_name, note, price, quantity)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (profile.role === "owner") {
    query = query.eq("owner_id", profile.id);
  }

  if (profile.role === "cashier") {
    if (!profile.ownerId) {
      return [];
    }

    query = query.eq("owner_id", profile.ownerId);
  }

  const { data } = await query.returns<OrderRow[]>();

  return (data ?? []).map(mapOrder);
}
