"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const items = [
  {
    id: 1,
    name: "Nasi Ayam",
    price: 25000,
    qty: 1,
    image: "https://images.unsplash.com/photo-1777033481363-96640776ae62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Sambal Matah",
    price: 4000,
    qty: 2,
    image: "https://images.unsplash.com/photo-1777033481363-96640776ae62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Susu Matcha",
    price: 25000,
    qty: 1,
    image: "https://images.unsplash.com/photo-1777033481363-96640776ae62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function CartPage() {
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Keranjang Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT - ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <Card className="p-4 flex flex-col gap-4 hover:shadow-md transition">
              {/* TOP SECTION (image + info) */}
              <div className="flex gap-4 items-start">
                {/* IMAGE */}
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />

                {/* INFO + QTY */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500 text-sm">Rp {item.price.toLocaleString()}</p>

                  {/* QTY */}
                  <div className="flex items-center gap-3 mt-3">
                    <Button variant="outline">-</Button>
                    <span>{item.qty}</span>
                    <Button variant="outline">+</Button>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION (NOTE - full width) */}
              <Input placeholder="Tulis catatan..." className="w-full" />
            </Card>
          ))}
        </div>

        {/* RIGHT - SUMMARY */}
        <div>
          <Card className="p-8 sticky top-10">
            <div className="flex justify-between items-center text-sm mb-4">
              <span>Jumlah Item:</span>
              <span>{items.length}</span>
            </div>

            {/* DASHED LINE */}
            <div className="border-t border-dashed my-1"></div>

            {/* TOTAL */}
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="text-xl font-semibold">Rp {total.toLocaleString()}</span>
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600">Checkout</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
