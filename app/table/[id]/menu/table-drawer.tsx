"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUp01Icon, Cancel01Icon} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle,} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

export function TableDrawer({ tableNumber }: { tableNumber: string }) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();

  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-svh">
        <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center px-4 text-center">
          <DrawerHeader className="p-0 w-full">
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => router.back()}
                className="absolute right-10 top-10 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm transition-colors hover:opacity-80"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2.5} />
              </button>

              <DrawerTitle className="text-2xl font-extrabold leading-tight tracking-tight">
                Meja #{tableNumber} tersedia!
              </DrawerTitle>
            </div>
          </DrawerHeader>

          <div className="relative mt-11 h-57 w-full overflow-hidden rounded-xl shadow-sm">
            <Image src="/img/placeholder-meja.jpg" alt="Meja tersedia" fill preload sizes="(max-width: 640px) 100vw, 384px" className="object-cover" />
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
      </DrawerContent>
    </Drawer>
  );
}
