"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { paymentMethods, type PaymentMethod } from "@/lib/order";
import { cn } from "@/lib/utils";

import { getCartTotals, getTotalQuantity, saveOrder } from "../_components/customer-cart";
import { CustomerPageHeader, CustomerPageShell, EmptyCustomerState, OrderItemRow, OrderTotals } from "../_components/customer-order-ui";
import { createCustomerOrder } from "../_components/order-actions";
import { useCartItems } from "../_components/customer-store-hooks";

const paymentMethodOptions: {
  description: string;
  label: PaymentMethod;
  value: PaymentMethod;
}[] = paymentMethods.map((method) => ({
  description:
    method === "QRIS"
      ? "Bayar dengan kode QRIS."
      : "Bayar melalui dompet digital.",
  label: method,
  value: method,
}));

type CheckoutViewProps = {
  tableId: string;
  tableNumber: string;
};

export function CheckoutView({ tableId, tableNumber }: CheckoutViewProps) {
  const router = useRouter();
  const items = useCartItems(tableId);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [method, setMethod] = React.useState<PaymentMethod | null>(null);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("QRIS");
  const [isPending, startTransition] = React.useTransition();

  function handlePay() {
    if (!method) {
      setSelectedMethod("QRIS");
      setDrawerOpen(true);
      return;
    }

    startTransition(async () => {
      const result = await createCustomerOrder({
        items: items.map((item) => ({
          id: item.id,
          note: item.note,
          quantity: item.quantity,
        })),
        paymentMethod: method,
        tableId,
      });

      if (result.error || !result.order) {
        toast.error(result.error ?? "Pesanan gagal dibuat.", {
          position: "top-center",
        });
        return;
      }

      saveOrder(result.order);

      router.push(`/table/${tableId}/checkout/payment/qris`);
    });
  }

  if (!items.length) {
    return (
      <CustomerPageShell>
        <CustomerPageHeader backHref={`/table/${tableId}/cart`} description="Keranjang meja ini masih kosong." tableNumber={tableNumber} title="Checkout" />
        <EmptyCustomerState description="Tambahkan makanan sebelum melanjutkan checkout." href={`/table/${tableId}/menu`} label="Lihat menu" title="Belum ada pesanan" />
      </CustomerPageShell>
    );
  }

  const totals = getCartTotals(items);

  return (
    <CustomerPageShell>
      <CustomerPageHeader backHref={`/table/${tableId}/cart`} description="Periksa kembali pesanan sebelum memilih pembayaran." tableNumber={tableNumber} title="Checkout" />

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader>
            <CardTitle>{getTotalQuantity(items)} item pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {items.map((item) => (
              <OrderItemRow item={item} key={item.id} />
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Total pembayaran</CardTitle>
            <CardDescription>Pilih metode sebelum membayar.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <OrderTotals {...totals} />
            <Drawer
              open={drawerOpen}
              onOpenChange={(open) => {
                setDrawerOpen(open);

                if (open) {
                  setSelectedMethod(method ?? "QRIS");
                }
              }}
            >
              <DrawerTrigger asChild>
                <Button type="button" variant="outline">
                  {method ? `Metode: ${method}` : "Pilih Pembayaran"}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Pilih metode pembayaran</DrawerTitle>
                  <DrawerDescription>Pilih metode yang ingin digunakan untuk pesanan ini.</DrawerDescription>
                </DrawerHeader>
                <FieldSet className="px-4">
                  <FieldLegend className="sr-only">Metode pembayaran</FieldLegend>
                  <RadioGroup onValueChange={(value) => setSelectedMethod(value as PaymentMethod)} value={selectedMethod}>
                    {paymentMethodOptions.map((paymentMethod) => (
                      <label className={cn("flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors", selectedMethod === paymentMethod.value && "border-primary bg-primary/5")} key={paymentMethod.value}>
                        <RadioGroupItem className="mt-0.5" value={paymentMethod.value} />
                        <span className="flex flex-col gap-1">
                          <span className="font-semibold">{paymentMethod.label}</span>
                          <span className="text-xs text-muted-foreground">{paymentMethod.description}</span>
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </FieldSet>
                <DrawerFooter>
                  <Button
                    onClick={() => {
                      setMethod(selectedMethod);
                      setDrawerOpen(false);
                    }}
                    type="button"
                  >
                    Pilih metode
                  </Button>
                  <DrawerClose asChild>
                    <Button type="button" variant="outline">
                      Batal
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Button disabled={isPending || !method} onClick={handlePay} type="button">
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Memproses
                </>
              ) : method === "QRIS" ? (
                "Buat QRIS"
              ) : method === "E-Wallet" ? (
                "Bayar E-Wallet"
              ) : (
                "Pilih metode dulu"
              )}
            </Button>
            <Button asChild variant="outline">
              <Link href={`/table/${tableId}/cart`}>Ubah keranjang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </CustomerPageShell>
  );
}
