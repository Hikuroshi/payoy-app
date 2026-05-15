import Image from "next/image";
import { DashboardSquare01Icon, Money03Icon, PackageIcon, QrCodeIcon, QuoteUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const metadata = {
  title: "Beranda",
};

const features = [
  {
    title: "QR Code Table Booking",
    description: "Kurangi antrean waiter, percepat layanan, dan pantau okupansi meja secara real-time dengan QR unik di setiap meja.",
    icon: QrCodeIcon,
  },
  {
    title: "Pengaturan Keuangan",
    description: "Pantau cashflow dan laporan laba rugi harian. Kelola pengeluaran outlet tanpa bergantung pada spreadsheet.",
    icon: Money03Icon,
  },
  {
    title: "Kelola Produk",
    description: "Hindari kehabisan produk favorit dengan update stok, pelacakan kedaluwarsa, dan reorder yang lebih teratur.",
    icon: PackageIcon,
  },
  {
    title: "Satu Kendali untuk Banyak Outlet",
    description: "Skalakan bisnis dengan dashboard pusat untuk memantau cabang, penjualan, stok, dan performa tiap lokasi.",
    icon: DashboardSquare01Icon,
  },
];

const testimonials = [
  {
    quote: "Saya owner UMKM sangat terbantu dengan adanya aplikasi Payoy! ini, fitur QR meja sangat membantu saya dalam menyelesaikan masalah antrian.",
    name: "Nathaniel Galih",
    role: "Owner toko roti dan cafe",
    avatar: "/img/user1.png",
  },
  {
    quote: "Ngga salah saya pilih Payoy! secara fitur banyak sekali yang diberikan, tampilan user friendly banget untuk pegawai baru langsung bisa pakai tanpa ribet.",
    name: "Viora",
    role: "Owner Ayam Bakar",
    avatar: "/img/user2.png",
  },
  {
    quote: "Aplikasi Payoy! bagus mudah digunakan, simpel, dan menarik. Semoga kedepannya ada fitur dashboard yang menampilkan grafik laporan penjualan.",
    name: "Icha",
    role: "Owner Cafe",
    avatar: "/img/user3.png",
  },
];

function StoreBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <a href="https://apps.apple.com/us/iphone/apps" target="_blank" rel="noopener noreferrer" aria-label="Download Payoy di App Store" className="block rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Image src="/img/app-store-badge.svg" alt="Download di App Store" width={120} height={40} className="h-10 w-auto" unoptimized loading="eager" />
      </a>

      <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer" aria-label="Download Payoy di Google Play" className="block rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Image src="/img/google-play-badge.svg" alt="Dapatkan di Google Play" width={135} height={40} className="h-10 w-auto" unoptimized loading="eager" />
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-background">
      <section id="beranda" className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col items-center px-4 pb-16 pt-24 text-center md:pb-20 md:pt-28">
        <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-tight tracking-normal md:text-5xl">Solusi digital untuk bisnis kuliner yang ingin tumbuh lebih cepat</h1>
        <p className="mt-5 max-w-4xl text-base leading-7 text-muted-foreground md:text-lg">Payoy membantu restoran, kafe, dan UMKM mengelola pesanan, meja, produk, serta laporan keuangan dalam satu aplikasi yang simpel, modern, dan mudah digunakan.</p>
        <div className="mt-8">
          <StoreBadges />
        </div>
        <div className="mt-20 w-full md:mt-24">
          <div className="mx-auto w-full max-w-70 overflow-hidden rounded-lg border bg-card shadow-xl shadow-foreground/10">
            <Image src="/img/payoy-example.png" alt="Tampilan contoh aplikasi Payoy" width={440} height={956} className="h-auto w-full" sizes="280px" loading="eager" />
          </div>
        </div>
      </section>

      <section id="layanan" className="border-y bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 md:grid-cols-[0.75fr_1.75fr] md:gap-20">
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
              Mulai jualan
              <br />
              tanpa ribet.
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-x-20 md:gap-y-16">
            {features.map((feature) => (
              <article key={feature.title} className="flex flex-col items-start gap-4">
                <div className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                  <HugeiconsIcon icon={feature.icon} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold tracking-normal">{feature.title}</h3>
                  <p className="text-base leading-7 text-muted-foreground">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimoni" className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-balance text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
          Apa Kata Pengguna <span className="text-primary">Payoy!</span>
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="min-h-65 justify-between">
              <CardContent className="flex flex-col gap-5">
                <HugeiconsIcon icon={QuoteUpIcon} strokeWidth={2} className="size-10 text-primary/40" aria-hidden="true" />
                <p className="text-sm leading-7 text-muted-foreground">{testimonial.quote}</p>
              </CardContent>

              <CardFooter className="mt-4 gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    loading="eager"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="download" className="bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-normal md:text-5xl">Siap untuk mengelola bisnis kuliner?</h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">Payoy tersedia di semua platform: website, Android, dan iOS.</p>
          <div className="mt-8">
            <StoreBadges />
          </div>
        </div>
      </section>
    </main>
  );
}
