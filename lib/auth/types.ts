export const userRoles = ["admin", "owner", "cashier"] as const;

export type UserRole = (typeof userRoles)[number];

export function normalizeRole(role: unknown): UserRole {
  return userRoles.includes(role as UserRole) ? (role as UserRole) : "owner";
}
