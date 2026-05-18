"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getSafeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function useCustomerDemoFlow() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  const buildHref = React.useCallback(
    (href: string) => {
      if (!isDemo) {
        return href;
      }

      const [pathWithSearch, hash = ""] = href.split("#");
      const [basePath, search = ""] = pathWithSearch.split("?");
      const nextParams = new URLSearchParams(search);

      nextParams.set("demo", "1");
      nextParams.set("returnTo", returnTo);

      const nextSearch = nextParams.toString();
      const hashSuffix = hash ? `#${hash}` : "";

      return `${basePath}${nextSearch ? `?${nextSearch}` : ""}${hashSuffix}`;
    },
    [isDemo, returnTo],
  );

  return {
    buildHref,
    isDemo,
    pathname,
    returnTo,
  };
}

export function CustomerDemoBanner({ className, returnHref }: { className?: string; returnHref?: string }) {
  const { isDemo, returnTo } = useCustomerDemoFlow();

  if (!isDemo) {
    return null;
  }

  return (
    <div className={cn("bg-primary text-primary-foreground py-1", className)}>
      <div className="mx-auto flex w-full items-center justify-center px-4 sm:px-5 md:px-6">
        <p className="text-xs">Mode demo pelanggan.</p>
        <Button asChild size="xs" variant="link" className="text-primary-foreground">
          <Link href={returnHref ?? returnTo}>Klik untuk kembali.</Link>
        </Button>
      </div>
    </div>
  );
}
