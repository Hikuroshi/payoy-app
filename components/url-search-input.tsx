"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

type UrlSearchInputProps = {
  className?: string;
  clearKeysOnChange?: string[];
  debounceMs?: number;
  placeholder: string;
  queryKey?: string;
};

export function UrlSearchInput({
  className,
  clearKeysOnChange = [],
  debounceMs = 1000,
  placeholder,
  queryKey = "query",
}: UrlSearchInputProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get(queryKey) ?? "";
  const timeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      window.clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        const currentSearch = searchParams.toString();
        const nextParams = new URLSearchParams(currentSearch);
        const normalizedValue = nextValue.trim();

        nextParams.delete("success");
        nextParams.delete("error");
        clearKeysOnChange.forEach((key) => nextParams.delete(key));

        if (normalizedValue) {
          nextParams.set(queryKey, normalizedValue);
        } else {
          nextParams.delete(queryKey);
        }

        const nextSearch = nextParams.toString();

        if (nextSearch === currentSearch) {
          return;
        }

        router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
          scroll: false,
        });
      }, debounceMs);
    },
    [clearKeysOnChange, debounceMs, pathname, queryKey, router, searchParams],
  );

  return <Input aria-label={placeholder} className={className} defaultValue={defaultValue} key={`${pathname}:${defaultValue}`} onChange={handleChange} placeholder={placeholder} type="search" />;
}
