type HeaderReader = {
  get(name: string): string | null;
};

function getFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || undefined;
}

export function getRequestOrigin(headers: HeaderReader) {
  const forwardedProto = getFirstHeaderValue(headers.get("x-forwarded-proto"));
  const forwardedHost = getFirstHeaderValue(headers.get("x-forwarded-host"));
  const host = getFirstHeaderValue(headers.get("host")) ?? "localhost:3000";
  const protocol = forwardedProto ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${protocol}://${forwardedHost ?? host}`;
}
