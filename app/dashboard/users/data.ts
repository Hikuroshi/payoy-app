import "server-only";

import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/admin";
import { normalizeRole, type UserRole } from "@/lib/auth/types";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastSignInAt: string | null;
};

type PublicUser = {
  id: string;
  name: string | null;
  role: string | null;
  created_at: string | null;
};

export async function getDashboardUsers(): Promise<{
  users: DashboardUser[];
  error?: string;
}> {
  if (!hasSupabaseAdminConfig()) {
    return {
      users: [],
      error: "User gagal dimuat.",
    };
  }

  const admin = createAdminClient();
  const [{ data: authData, error: authError }, { data: publicUsers, error: usersError }] = await Promise.all([admin.auth.admin.listUsers({ page: 1, perPage: 1000 }), admin.from("users").select("id, name, role, created_at").returns<PublicUser[]>()]);

  if (authError) {
    return { users: [], error: "User gagal dimuat." };
  }

  if (usersError) {
    return { users: [], error: "User gagal dimuat." };
  }

  const publicUserById = new Map((publicUsers ?? []).map((user) => [user.id, user]));

  return {
    users: authData.users.map((authUser) => {
      const publicUser = publicUserById.get(authUser.id);
      const metadataName = typeof authUser.user_metadata?.name === "string" ? authUser.user_metadata.name : undefined;

      return {
        id: authUser.id,
        name: publicUser?.name ?? metadataName ?? authUser.email ?? "Tanpa nama",
        email: authUser.email ?? "",
        role: normalizeRole(publicUser?.role),
        createdAt: publicUser?.created_at ?? authUser.created_at,
        lastSignInAt: authUser.last_sign_in_at ?? null,
      };
    }),
  };
}

export async function getDashboardUser(id: string): Promise<{
  user?: DashboardUser;
  error?: string;
}> {
  if (!hasSupabaseAdminConfig()) {
    return {
      error: "User gagal dimuat.",
    };
  }

  const admin = createAdminClient();
  const [{ data: authData, error: authError }, { data: publicUser, error: userError }] = await Promise.all([
    admin.auth.admin.getUserById(id),
    admin.from("users").select("id, name, role, created_at").eq("id", id).maybeSingle<PublicUser>(),
  ]);

  if (authError) {
    return { error: "User gagal dimuat." };
  }

  if (userError) {
    return { error: "User gagal dimuat." };
  }

  if (!authData.user) {
    return { error: "User tidak ditemukan." };
  }

  const metadataName = typeof authData.user.user_metadata?.name === "string" ? authData.user.user_metadata.name : undefined;

  return {
    user: {
      id: authData.user.id,
      name: publicUser?.name ?? metadataName ?? authData.user.email ?? "Tanpa nama",
      email: authData.user.email ?? "",
      role: normalizeRole(publicUser?.role),
      createdAt: publicUser?.created_at ?? authData.user.created_at,
      lastSignInAt: authData.user.last_sign_in_at ?? null,
    },
  };
}
