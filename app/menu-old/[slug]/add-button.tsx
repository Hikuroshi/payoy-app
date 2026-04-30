"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckoutBar } from "../menu";

export function AddButton({ foodName, price }: { foodName: string; price: number }) {
  const [count, setCount] = React.useState(0);

  function addFood() {
    setCount((current) => current + 1);

    toast.success("Item ditambahkan", {
      description: `${foodName} masuk ke checkout.`,
      duration: 1800,
    });
  }

  return (
    <>
      <div className="mt-6">
        <Button type="button" className="w-full sm:w-fit" onClick={addFood}>
          Tambah
        </Button>
      </div>

      <CheckoutBar count={count} total={count * price} />
    </>
  );
}
