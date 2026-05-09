const tablePathPattern = /^\/table\/([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:\/menu)?\/?$/i;

export function getTableMenuPathFromQr(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalizedValue)) {
    return `/table/${normalizedValue}/menu`;
  }

  const candidates = [normalizedValue];

  if (/^https?:\/\//i.test(normalizedValue)) {
    try {
      const url = new URL(normalizedValue);
      candidates.push(url.pathname);
    } catch {
      return null;
    }
  }

  if (!normalizedValue.startsWith("/")) {
    const embeddedPath = normalizedValue.match(/\/table\/[0-9a-f-]{36}(?:\/menu)?\/?/i)?.[0];

    if (embeddedPath) {
      candidates.push(embeddedPath);
    }
  }

  for (const candidate of candidates) {
    const match = candidate.match(tablePathPattern);

    if (match) {
      return `/table/${match[1]}/menu`;
    }
  }

  return null;
}
