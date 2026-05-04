import "server-only";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";

export type DashboardCashier = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
};

type PublicCashier = {
  id: string;
  name: string | null;
  created_at: string | null;
};

export async function getOwnerCashiers(ownerId: string): Promise<{
  cashiers: DashboardCashier[];
  error?: string;
}> {
  if (!hasSupabaseAdminConfig()) {
    return { cashiers: [], error: "Cashier gagal dimuat." };
  }

  const admin = createAdminClient();
  const [{ data: publicCashiers, error: cashiersError }, { data: authData, error: authError }] =
    await Promise.all([
      admin
        .from("users")
        .select("id, name, created_at")
        .eq("role", "cashier")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false })
        .returns<PublicCashier[]>(),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

  if (cashiersError || authError) {
    return { cashiers: [], error: "Cashier gagal dimuat." };
  }

  const authUserById = new Map(authData.users.map((user) => [user.id, user]));

  return {
    cashiers: (publicCashiers ?? []).map((cashier) => {
      const authUser = authUserById.get(cashier.id);
      const metadataName =
        typeof authUser?.user_metadata?.name === "string"
          ? authUser.user_metadata.name
          : undefined;

      return {
        createdAt: cashier.created_at ?? authUser?.created_at ?? "",
        email: authUser?.email ?? "",
        id: cashier.id,
        lastSignInAt: authUser?.last_sign_in_at ?? null,
        name: cashier.name ?? metadataName ?? authUser?.email ?? "Tanpa nama",
      };
    }),
  };
}

export async function getOwnerCashier(
  ownerId: string,
  id: string
): Promise<{
  cashier?: DashboardCashier;
  error?: string;
}> {
  if (!hasSupabaseAdminConfig()) {
    return { error: "Cashier gagal dimuat." };
  }

  const admin = createAdminClient();
  const [{ data: publicCashier, error: cashierError }, { data: authData, error: authError }] =
    await Promise.all([
      admin
        .from("users")
        .select("id, name, created_at")
        .eq("id", id)
        .eq("role", "cashier")
        .eq("owner_id", ownerId)
        .maybeSingle<PublicCashier>(),
      admin.auth.admin.getUserById(id),
    ]);

  if (cashierError || authError) {
    return { error: "Cashier gagal dimuat." };
  }

  if (!publicCashier || !authData.user) {
    return { error: "Cashier tidak ditemukan." };
  }

  const metadataName =
    typeof authData.user.user_metadata?.name === "string"
      ? authData.user.user_metadata.name
      : undefined;

  return {
    cashier: {
      createdAt: publicCashier.created_at ?? authData.user.created_at,
      email: authData.user.email ?? "",
      id: publicCashier.id,
      lastSignInAt: authData.user.last_sign_in_at ?? null,
      name: publicCashier.name ?? metadataName ?? authData.user.email ?? "Tanpa nama",
    },
  };
}
