import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { customerOrderStatusRequestSchema } from "@/lib/customer-order-schema";
import { isOrderStatus } from "@/lib/order";

export const dynamic = "force-dynamic";

type OrderStatusRow = {
  id: string;
  status: string;
  paid_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
    status,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = customerOrderStatusRequestSchema.safeParse({
    id,
    tableId: request.nextUrl.searchParams.get("tableId"),
  });

  if (!parsed.success) {
    return jsonResponse({ error: "Pesanan tidak valid." }, 400);
  }

  if (!hasSupabaseAdminConfig()) {
    return jsonResponse({ error: "Status pesanan gagal dimuat." }, 500);
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("id, status, paid_at, completed_at, updated_at")
    .eq("id", parsed.data.id)
    .eq("table_id", parsed.data.tableId)
    .maybeSingle<OrderStatusRow>();

  if (error) {
    return jsonResponse({ error: "Status pesanan gagal dimuat." }, 500);
  }

  if (!data) {
    return jsonResponse({ error: "Pesanan tidak ditemukan." }, 404);
  }

  if (!isOrderStatus(data.status)) {
    return jsonResponse({ error: "Status pesanan tidak valid." }, 500);
  }

  return jsonResponse({
    completedAt: data.completed_at,
    id: data.id,
    paidAt: data.paid_at,
    status: data.status,
    updatedAt: data.updated_at,
  });
}
