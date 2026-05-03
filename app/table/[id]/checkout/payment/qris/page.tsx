"use client";

import { ArrowLeft01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

export default function QrisPaymentPage() {
  const paymentDetails = {
    merchant: "Payoy",
    amount: "Rp 61.000",
    expiry: "09 April 2026, 21:06",
  };

  const handleDownload = () => {
    toast.success("QRIS Berhasil Diunduh", {
      description: "File telah disimpan ke folder unduhan Anda.",
      duration: 1800,
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <header className="relative w-full pt-10 pb-6 flex items-center justify-center px-6">
        <button type="button" className="absolute left-24 p-3 rounded-full bg-card shadow-sm text-foreground hover:bg-accent transition-all">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">QRIS</h1>
      </header>

      <section className="flex-1 w-full max-w-sm flex flex-col items-center px-6 text-center">
        <div className="mt-6 space-y-1">
          <h2 className="text-2xl font-bold text-foreground">{paymentDetails.merchant}</h2>
          <p className="text-4xl font-black text-foreground mt-1">{paymentDetails.amount}</p>
        </div>

        <div className="mt-8 bg-card p-5 rounded-3xl border border-border">
          <div className="bg-background p-3 rounded-2xl">
            <div className="w-56 h-56 relative">
              <Image src="/img/qris.png" alt="QRIS Code" fill className="object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-card border border--border rounded-full">
          <div className="w-2 h-2 rounded-full bg-apps-secondary-600 animate-pulse" />
          <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide">
            Berlaku sampai: <span className=" text-apps-primary-600 font-bold">{paymentDetails.expiry}</span>
          </p>
        </div>
      </section>

      <section className="w-full max-w-125 flex flex-col gap-3 mt-auto pb-10 pt-8">
        <Link href="/payment" passHref className="w-full block">
          <Button variant="outline" className="w-full h-15 rounded-2xl border-2 border-apps-primary-600 text-foreground font-bold text-lg hover:bg-apps-primary-200 transition-all flex items-center justify-center gap-2">
            Ganti Metode Pembayaran
          </Button>
        </Link>
        <Button onClick={handleDownload} className=" bg-apps-primary-600 w-full h-15 rounded-2xl text-foreground font-bold text-lg hover:bg-apps-primary-400 transition-all flex items-center justify-center gap-2">
          <HugeiconsIcon icon={Download01Icon} size={18} className="mr-2" />
          Unduh QRIS
        </Button>
      </section>
    </main>
  );
}
