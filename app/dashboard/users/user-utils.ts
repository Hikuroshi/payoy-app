import type { UserRole } from "@/lib/auth/types";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  owner: "Owner",
  cashier: "Cashier",
};

export function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getRoleBadgeVariant(role: UserRole) {
  if (role === "admin") {
    return "default";
  }

  if (role === "owner") {
    return "secondary";
  }

  return "outline";
}
