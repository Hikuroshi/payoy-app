"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-sm gap-4">
        <img src="/img/error page 2.svg" alt="Error Illustration" className="w-80 h-80 object-contain w-[420px] object-contain mb-[-60 px]" />

        <h1 className="text-xl font-semibold">Dashboard gagal dimuat</h1>

        <p className="text-sm text-muted-foreground mb-3">Kami tidak dapat menampilkan data saat ini. Silakan muat halaman kembali.</p>

        <Button onClick={() => reset()} className="bg-orange-500 hover:bg-orange-600">
          Muat Halaman
        </Button>
      </div>
    </div>
  );
}
