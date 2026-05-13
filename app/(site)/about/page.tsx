import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Tentang Kami",
};

const storyItems = [
  {
    label: "History",
    title: "Berangkat dari antrean panjang",
    description: "Payoy lahir dari permasalahan antrean panjang dan sistem kasir manual yang kurang efisien di banyak UMKM, khususnya di bidang kuliner. Fitur QR Table dikembangkan untuk mempermudah pemesanan dan mempercepat layanan.",
  },
  {
    label: "Mission",
    title: "Membantu UMKM bergerak digital",
    description: "Misi Payoy adalah membantu UMKM bertransformasi ke sistem digital yang lebih efisien melalui solusi POS yang mudah digunakan, data yang rapi, dan laporan yang akurat.",
  },
  {
    label: "Values",
    title: "Mudah, andal, dan fokus ke pengguna",
    description: "Payoy menjunjung nilai inovasi, kemudahan penggunaan, efisiensi operasional, keandalan sistem, serta fokus pada kebutuhan pemilik usaha dan pelanggan.",
  },
];

export default function About() {
  return (
    <main className="bg-background">
      <section className="relative min-h-112 overflow-hidden">
        <Image src="/img/cover.png" alt="Tim Payoy melayani bisnis kuliner" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-foreground/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-foreground/20" />

        <div className="relative mx-auto flex min-h-112 max-w-6xl items-center px-4 py-20">
          <div className="max-w-3xl text-primary-foreground">
            <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-5xl">Partner digital untuk operasional kuliner yang lebih rapi</h1>
            <p className="mt-5 text-base leading-7 text-primary-foreground/90 md:text-lg">Payoy adalah aplikasi Point of Sale modern yang dirancang untuk membantu pelaku UMKM mengelola operasional bisnis secara lebih efisien dan profesional, mulai dari transaksi, manajemen produk, QR Table, hingga laporan penjualan dalam satu platform.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">Dibangun untuk kebutuhan nyata UMKM</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Setiap fitur Payoy dirancang untuk membantu pemilik usaha mengurangi pekerjaan manual dan mengambil keputusan dengan data yang lebih jelas.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {storyItems.map((item) => (
            <article key={item.label} className="border-l border-border pl-6">
              <Badge variant="secondary" className="mb-4">
                {item.label}
              </Badge>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
