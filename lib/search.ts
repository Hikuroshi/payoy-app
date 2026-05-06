export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export function getParamValue(
  searchParams: SearchParamsRecord,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export function normalizeSearchQuery(value?: string | null) {
  const query = value?.trim();
  return query ? query : undefined;
}

export function toSupabaseLikePattern(query: string) {
  const escapedQuery = query
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");

  return `%${escapedQuery}%`;
}

export function matchesSearch(
  query: string | undefined,
  ...values: Array<string | null | undefined>
) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLocaleLowerCase("id-ID");

  return values.some((value) =>
    value?.toLocaleLowerCase("id-ID").includes(normalizedQuery)
  );
}
