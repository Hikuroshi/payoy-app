import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/server";
import { normalizeRole, type UserRole } from "@/lib/auth/types";

export type CurrentUserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", user.id)
    .maybeSingle();

  const email = user.email ?? "";
  const metadataName =
    typeof user.user_metadata.name === "string"
      ? user.user_metadata.name
      : typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : undefined;

  return {
    id: user.id,
    email,
    fullName: profile?.name ?? metadataName ?? email,
    role: normalizeRole(profile?.role),
  };
}

export async function requireUserProfile(): Promise<CurrentUserProfile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireAdminProfile(): Promise<CurrentUserProfile> {
  const profile = await requireUserProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}

export async function requireOwnerProfile(): Promise<CurrentUserProfile> {
  const profile = await requireUserProfile();

  if (profile.role !== "owner") {
    redirect("/dashboard");
  }

  return profile;
}
