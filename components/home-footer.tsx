import Image from "next/image";
import Link from "next/link";
import { Facebook02Icon, InstagramIcon, Linkedin02Icon, TiktokIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

const footerNavItems = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/service" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

const socialItems = [
  { label: "Instagram", href: "https://www.instagram.com/", target: "_blank", rel: "noopener noreferrer", icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/", target: "_blank", rel: "noopener noreferrer", icon: Facebook02Icon },
  { label: "TikTok", href: "https://www.tiktok.com/", target: "_blank", rel: "noopener noreferrer", icon: TiktokIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", target: "_blank", rel: "noopener noreferrer", icon: Linkedin02Icon },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.8fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-3 text-2xl font-semibold tracking-normal text-foreground transition-colors hover:text-primary">
            <Image src="/img/payoy-logo.png" alt="Payoy" width={832} height={832} className="size-12 object-contain" sizes="48px" />
            <span>Payoy!</span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">Payoy adalah platform modern yang membantu pengguna mengelola kebutuhan digital dengan lebih mudah, cepat, dan nyaman.</p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Menu</h3>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Navigasi footer">
            {footerNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Sosial Media</h3>
          <div className="flex flex-wrap gap-2">
            {socialItems.map((item) => (
              <Button key={item.label} variant="outline" size="icon" asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  target={item.target}
                  rel={item.rel}
                >
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t px-4 py-5 text-center text-sm text-muted-foreground">
        <p>© 2026 Payoy. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
