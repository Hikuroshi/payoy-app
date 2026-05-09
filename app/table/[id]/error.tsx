"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function TableError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <Image src="/img/error page 2.svg" alt="Proses pemesanan gagal dimuat" width={420} height={320} className="h-auto w-full max-w-105 object-contain" priority />

        <h1 className="text-xl font-semibold">Proses pemesanan gagal dimuat</h1>

        <p className="mb-3 text-sm text-muted-foreground">Kami tidak dapat meneruskan proses pemesanan saat ini. Silakan muat halaman kembali.</p>

        <Button onClick={() => unstable_retry()}>Muat Halaman</Button>
      </div>
    </div>
  );
}
