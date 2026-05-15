"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUp01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

export function TableDrawer({ closeHref, showCloseButton = false, tableNumber }: { closeHref?: string; showCloseButton?: boolean; tableNumber: string }) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();

  function handleClose() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    if (closeHref) {
      router.replace(closeHref);
    }
  }

  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-dvh p-0 before:inset-0 before:rounded-none before:border-0 data-[vaul-drawer-direction=top]:mb-0 data-[vaul-drawer-direction=top]:max-h-dvh">
        <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center px-4 text-center">
          <DrawerHeader className="w-full p-0">
            <div className="flex items-center justify-center gap-8">
              {showCloseButton ? (
                <Button aria-label="Tutup mode demo" className="absolute right-10 top-10 z-10 rounded-full shadow-sm" onClick={handleClose} size="icon-lg" type="button" variant="secondary">
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2.5} />
                </Button>
              ) : null}

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
      </DrawerContent>
    </Drawer>
  );
}
