"use client";

import Link from "next/link";
import { Briefcase01Icon, Home01Icon, InformationCircleIcon, Mail01Icon, Menu01Icon, Login01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const navItems = [
  { label: "Beranda", href: "/", icon: Home01Icon },
  { label: "Layanan", href: "/service", icon: Briefcase01Icon },
  { label: "Tentang Kami", href: "/about", icon: InformationCircleIcon },
  { label: "Kontak", href: "/contact", icon: Mail01Icon },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-normal text-foreground transition-colors hover:text-primary">
          <Image src="/img/payoy-logo.png" alt="Payoy" width={832} height={832} className="size-10 object-contain" sizes="40px" priority />
          <span>Payoy!</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-1" aria-label="Navigasi utama">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          <Button asChild size="lg">
            <Link href="/dashboard">Demo aplikasi</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Buka menu">
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
              </Button>
            </SheetTrigger>

            <SheetContent aria-describedby={undefined}>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-1 flex-col gap-2 px-4" aria-label="Navigasi utama mobile">
                {navItems.map((item) => (
                  <Button variant="outline" asChild key={item.href} className="w-full justify-start">
                    <Link href={item.href}>
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} data-icon="inline-start" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>

              <SheetFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    <HugeiconsIcon icon={Login01Icon} strokeWidth={2} data-icon="inline-start" />
                    Demo aplikasi
                  </Link>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
