"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function PaymentStatusPage() {
  const handleDownloadReceipt = () => {
    toast.success("Struk Berhasil Diunduh", {
      description: "Struk pembayaran telah disimpan ke perangkat Anda.",
      duration: 1800,
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <header className="pt-10 pb-6 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Status Pembayaran</h1>
      </header>
      <br />
      <section className="flex-1 flex flex-col items-center px-8 pb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8 leading-tight">Yeay Berhasil!</h2>

        <div className="relative w-full aspect-square max-w-75 mb-8">
          <Image src="/img/succes.png" alt="Success Celebration" fill className="object-contain" priority />
        </div>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-2">Silahkan pantau status pesanan dan tunggu pesanan datang yaa</p>
      </section>
      <section className="w-full max-w-125 flex flex-col gap-3 mt-auto pb-10">
        <Button variant="outline" onClick={handleDownloadReceipt} className="w-full h-15 rounded-2xl border-2 border-apps-primary-600 text-foreground font-bold text-lg hover:bg-apps-primary-200 transition-all flex items-center justify-center gap-2">
          <HugeiconsIcon icon={Download01Icon} />
          Unduh Struk
        </Button>

        <Link href="/menu" passHref className="w-full block">
          <Button className="w-full h-15 rounded-2xl bg-apps-primary-600 text-foreground font-bold text-lg hover:bg-apps-primary-400 transition-all flex items-center justify-center gap-2">Selesai</Button>
        </Link>
      </section>
    </main>
  );
}
