"use client";

import { ArrowLeft01Icon, TickDouble02Icon, Clock01Icon, Task01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import StepProgress from "@/components/ui/stepper"; // Pastikan path import sesuai
import Image from "next/image";
import Link from "next/link";

export default function OrderStatusPage() {
  const orderDetails = {
    orderNo: "#PY103",
    table: "02",
    method: "QRIS",
    total: "Rp 61.000",
  };

  const orderItems = [
    { name: "Nasi Ayam", qty: 1, price: "Rp 25.000", img: "/img/nasi.png" },
    { name: "Sambal Matah", qty: 2, price: "Rp 8.000", img: "/img/sambal.png" },
    { name: "Susu Matcha", qty: 1, price: "Rp 25.000", img: "/img/matcha.png" },
  ];

  // Definisi steps untuk komponen Stepper
  const steps = [
    {
      label: "Pesanan Diterima",
      icon: <HugeiconsIcon icon={Task01Icon} size={20} />,
    },
    {
      label: "Pesanan Diproses",
      icon: <HugeiconsIcon icon={Clock01Icon} size={20} />,
    },
    {
      label: "Pesanan Selesai",
      icon: <HugeiconsIcon icon={TickDouble02Icon} size={20} />,
    },
  ];

  return (
    <main className="min-h-screen bg-card flex flex-col items-center">
      {/* Header */}
      <header className="relative w-full pt-10 pb-6 flex items-center justify-center px-6">
        <button type="button" className="absolute left-24 p-3 rounded-full bg-card shadow-sm text-foreground hover:bg-accent transition-all">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Status Pesanan</h1>
      </header>

      <section className="w-full max-w-7xl px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Status & Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card p-8 md:p-12 text-center">
            <div className="space-y-2 mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Pesanan selesai</h2>
              <p className="text-muted-foreground text-lg">Terimakasih sudah berkunjung</p>
            </div>

            {/* Implementasi Stepper yang sudah dibuat */}
            <div className="max-w-md mx-auto mb-10">
              <StepProgress steps={steps} currentStep={3} />
            </div>

            {/* Order Details Card */}
            <div className="bg-apps-primary-200 rounded-[24px] p-6 md:p-8 space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">No. Pesanan</span>
                <span className="text-foreground font-bold text-lg">{orderDetails.orderNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Meja</span>
                <span className="text-foreground font-bold text-lg">{orderDetails.table}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Metode Pembayaran</span>
                <span className="text-foreground font-bold text-lg">{orderDetails.method}</span>
              </div>
              <div className="pt-4 border-t border-apps-primary-400 flex justify-between items-center">
                <span className="text-foreground font-bold">Total</span>
                <span className="text-apps-primary-600 font-black text-2xl">{orderDetails.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Action */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card p-8 rounded-[32px] border border-border flex-1">
            <h3 className="text-xl font-bold text-foreground mb-6">Ringkasan Pesanan</h3>
            <div className="space-y-6">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-card border-border">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{item.name}</h4>
                    <span className="text-sm text-muted-foreground font-medium">x{item.qty}</span>
                  </div>
                  <span className="font-bold text-accent-foreground">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/menu" passHref className="w-full block">
            <Button className="w-full h-15 rounded-2xl bg-apps-primary-600 text-foreground font-bold text-lg hover:bg-apps-primary-400 transition-all flex items-center justify-center gap-2">Selesai</Button>
          </Link>
        </section>
      </section>
    </main>
  );
}
