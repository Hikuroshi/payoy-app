import { z } from "zod";

export const uuidSchema = z.uuid();

export function isUuid(value: string) {
  return uuidSchema.safeParse(value).success;
}
