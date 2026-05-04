"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { createPublicClient } from "@/lib/public-server";

import type { CustomerOrder, CustomerOrderStatus } from "./customer-cart";

const paymentMethods = ["QRIS", "E-Wallet"] as const;

const orderItemSchema = z.object({
  id: z.uuid(),
  note: z.string().max(200).optional(),
  quantity: z.number().int().min(1).max(99),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(paymentMethods),
  tableId: z.uuid(),
});

const markPaidSchema = z.object({
  id: z.uuid(),
});

type TableRow = {
  id: string;
  number: string;
  owner_id: string;
};

type FoodRow = {
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  price: number | string;
};

function createOrderCode() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(10 + Math.random() * 90);

  return `PY${timestamp}${random}`;
}

function getImageUrl(supabase: ReturnType<typeof createPublicClient>, path: string | null) {
  if (!path) {
    return "";
  }

  return supabase.storage.from("menu_image").getPublicUrl(path).data.publicUrl;
}

export async function createCustomerOrder(
  input: unknown
): Promise<{ error: string; order?: never } | { error?: never; order: CustomerOrder }> {
  const parsed = createOrderSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Pesanan tidak valid." };
  }

  const supabase = createPublicClient();
  const { items, paymentMethod, tableId } = parsed.data;
  const { data: table, error: tableError } = await supabase
    .from("restaurant_tables")
    .select("id, number, owner_id")
    .eq("id", tableId)
    .maybeSingle<TableRow>();

  if (tableError || !table) {
    return { error: "Meja tidak ditemukan." };
  }

  const foodIds = [...new Set(items.map((item) => item.id))];
  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id, name, description, image_path, price")
    .eq("owner_id", table.owner_id)
    .eq("is_available", true)
    .in("id", foodIds)
    .returns<FoodRow[]>();

  if (foodsError) {
    return { error: "Menu gagal dimuat." };
  }

  const foodsById = new Map((foods ?? []).map((food) => [food.id, food]));
  const orderItems = items
    .map((item) => {
      const food = foodsById.get(item.id);

      if (!food) {
        return null;
      }

      return {
        description: food.description ?? "",
        foodId: food.id,
        imageUrl: getImageUrl(supabase, food.image_path),
        name: food.name,
        note: item.note ?? "",
        price: Number(food.price),
        quantity: item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!orderItems.length) {
    return { error: "Makanan tidak tersedia." };
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const adminFee = 2000;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + adminFee + tax;
  const createdAt = new Date();
  const paidAt = null;
  const orderId = crypto.randomUUID();
  const code = createOrderCode();
  const status: CustomerOrderStatus = "waiting_payment";

  const { error: orderError } = await supabase.from("orders").insert({
    admin_fee: adminFee,
    code,
    created_at: createdAt.toISOString(),
    id: orderId,
    owner_id: table.owner_id,
    paid_at: paidAt,
    payment_method: paymentMethod,
    status,
    subtotal,
    table_id: table.id,
    table_number: table.number,
    tax,
    total,
    updated_at: createdAt.toISOString(),
  });

  if (orderError) {
    return { error: "Pesanan gagal dibuat." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      food_id: item.foodId,
      food_name: item.name,
      note: item.note || null,
      order_id: orderId,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    return { error: "Item pesanan gagal disimpan." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/orders/history");

  return {
    order: {
      adminFee,
      createdAt: createdAt.toISOString(),
      databaseId: orderId,
      expiryAt: new Date(createdAt.getTime() + 15 * 60 * 1000).toISOString(),
      id: code,
      items: orderItems.map((item) => ({
        description: item.description,
        id: item.foodId,
        imageUrl: item.imageUrl,
        name: item.name,
        note: item.note,
        price: item.price,
        quantity: item.quantity,
      })),
      paidAt: paidAt ?? undefined,
      paymentMethod,
      status,
      subtotal,
      tableId: table.id,
      tableNumber: table.number,
      tax,
      total,
    },
  };
}

export async function markCustomerOrderPaid(input: unknown) {
  const parsed = markPaidSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Pesanan tidak valid." };
  }

  if (!hasSupabaseAdminConfig()) {
    return { error: "Koneksi pembayaran belum siap." };
  }

  const paidAt = new Date().toISOString();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .update({
      paid_at: paidAt,
      status: "paid",
      updated_at: paidAt,
    })
    .eq("id", parsed.data.id)
    .select("id, paid_at, status")
    .maybeSingle<{ id: string; paid_at: string | null; status: string }>();

  if (error || !data || data.status !== "paid") {
    return { error: "Pembayaran gagal disimpan." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");

  return { paidAt: data.paid_at ?? paidAt, status: "paid" as const };
}
