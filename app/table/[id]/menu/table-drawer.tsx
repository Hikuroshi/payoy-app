"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CustomerDemoBanner } from "../_components/customer-demo-flow";

export function TableDrawer({ demoReturnTo, tableNumber }: { demoReturnTo?: string; tableNumber: string }) {
  const [open, setOpen] = React.useState(true);

  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-dvh p-0 before:inset-0 before:rounded-none before:border-0 data-[vaul-drawer-direction=top]:mb-0 data-[vaul-drawer-direction=top]:max-h-dvh">
        <div className="flex min-h-dvh w-full flex-col">
          <CustomerDemoBanner returnHref={demoReturnTo} />
          <div className="mx-auto flex min-h-0 w-full max-w-sm flex-1 flex-col items-center justify-center px-4 text-center">
          <DrawerHeader className="w-full p-0">
            <div className="flex items-center justify-center gap-8">
              <DrawerTitle className="text-2xl font-extrabold leading-tight tracking-tight">Meja #{tableNumber} tersedia!</DrawerTitle>
            </div>
            <DrawerDescription className="sr-only">Informasi meja tersedia</DrawerDescription>
          </DrawerHeader>

          <div className="relative mt-11 h-57 w-full overflow-hidden rounded-xl shadow-sm">
            <Image src="/img/placeholder-meja.jpg" alt="Meja tersedia" fill loading="eager" sizes="(max-width: 640px) 100vw, 384px" className="object-cover" />
          </div>

          <p className="mt-11 text-lg font-medium leading-6">
            Scroll ke atas
            <br />
            untuk membuka menu
          </p>

          <div className="mt-14 flex animate-bounce items-center justify-center">
            <HugeiconsIcon icon={ArrowUp01Icon} size={32} strokeWidth={2} />
          </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
