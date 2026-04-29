export const userRoles = ["admin", "owner", "cashier"] as const;

export type UserRole = (typeof userRoles)[number];

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  submissionId?: string;
  success?: boolean;
  values?: {
    name?: string;
    email?: string;
  };
};

export const initialAuthFormState: AuthFormState = {};

export function normalizeRole(role: unknown): UserRole {
  return userRoles.includes(role as UserRole) ? (role as UserRole) : "owner";
}
