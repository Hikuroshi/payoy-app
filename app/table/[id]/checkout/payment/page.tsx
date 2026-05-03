"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const items = [
  {
    id: 1,
    name: "Nasi Ayam",
    price: 25000,
    qty: 1,
    note: "Tidak pedas",
    image: "https://images.unsplash.com/photo-1777033481363-96640776ae62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Sambal Matah",
    price: 4000,
    qty: 2,
    note: "Extra sambal",
    image: "https://images.unsplash.com/photo-1777033481363-96640776ae62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Susu Matcha",
    price: 25000,
    qty: 1,
    note: "-",
    image: "https://images.unsplash.com/photo-1777033481363-96640776ae62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const adminFee = 2000;
  const tax = subtotal * 0.1;
  const total = subtotal + adminFee + tax;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Pembayaran</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT - BIG CARD */}
        <Card className="p-6 lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4 last:border-none">
              {/* IMAGE */}
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />

              {/* CONTENT */}
              <div className="flex-1">
                {/* NAME */}
                <h2 className="font-semibold text-lg">{item.name}</h2>

                {/* QTY */}
                <p className="text-sm text-gray-500 mt-1">Jumlah: {item.qty}</p>

                {/* NOTE + PRICE */}
                <div className="flex justify-between items-start mt-3">
                  <p className="text-sm text-gray-500">Catatan: {item.note}</p>

                  <p className="font-medium">Rp {(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* RIGHT - SMALL CARD */}
        <Card className="p-6 h-fit">
          {/* SUBTOTAL */}
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>

          {/* ADMIN */}
          <div className="flex justify-between text-sm mb-2">
            <span>Biaya Admin</span>
            <span>Rp {adminFee.toLocaleString()}</span>
          </div>

          {/* TAX */}
          <div className="flex justify-between text-sm mb-4">
            <span>Pajak</span>
            <span>Rp {tax.toLocaleString()}</span>
          </div>

          {/* DASHED LINE */}
          <div className="border-t border-dashed my-4"></div>

          {/* TOTAL */}
          <div className="flex flex-col gap-1 mb-6">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-semibold">Rp {total.toLocaleString()}</span>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3">
            {/* PAYMENT METHOD */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 relative z-50">
                  {selectedMethod ? selectedMethod : "Metode Pembayaran"}
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <div className="p-6">
                  <DrawerHeader>
                    <DrawerTitle>Pilih Metode Pembayaran</DrawerTitle>
                  </DrawerHeader>

                  <div className="space-y-3 mt-4">
                    <Card onClick={() => setSelectedMethod("OVO")} className="p-4 cursor-pointer hover:bg-gray-50">
                      OVO
                    </Card>

                    <Card onClick={() => setSelectedMethod("GoPay")} className="p-4 cursor-pointer hover:bg-gray-50">
                      GoPay
                    </Card>

                    <Card onClick={() => setSelectedMethod("Transfer Bank")} className="p-4 cursor-pointer hover:bg-gray-50">
                      Transfer Bank
                    </Card>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* PAY BUTTON (DISABLED) */}
            <Button disabled={!selectedMethod} className={`bg-orange-500 text-white ${!selectedMethod ? "opacity-50 cursor-not-allowed" : ""}`}>
              Bayar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
