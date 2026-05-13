import { CheckmarkCircle02Icon, DashboardSquare01Icon, Money03Icon, PackageIcon, QrCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Layanan",
};

const services = [
  {
    title: "QR Code Table Booking",
    description: "Pesanan lebih cepat tanpa antre panjang.",
    icon: QrCodeIcon,
    points: ["QR unik untuk setiap meja", "Alur pemesanan lebih mandiri", "Status meja lebih mudah dipantau"],
  },
  {
    title: "Pengaturan Keuangan",
    description: "Semua laporan dalam satu dashboard.",
    icon: Money03Icon,
    points: ["Laporan keuangan otomatis", "Tracking pemasukan dan pengeluaran", "Insight bisnis untuk keputusan lebih tepat"],
  },
  {
    title: "Kelola Produk",
    description: "Stok aman, operasional tetap lancar.",
    icon: PackageIcon,
    points: ["Update stok secara real-time", "Notifikasi stok menipis", "Manajemen menu lebih fleksibel"],
  },
  {
    title: "Kendali Multi Outlet",
    description: "Kelola cabang dari satu tempat.",
    icon: DashboardSquare01Icon,
    points: ["Monitoring multi-outlet", "Laporan per cabang", "Skalakan bisnis tanpa chaos operasional"],
  },
];

export default function Service() {
  return (
    <main className="bg-background">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-normal md:text-5xl">Solusi lengkap untuk operasional bisnis kuliner</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Payoy membantu proses pemesanan, pencatatan, pengelolaan produk, dan pemantauan outlet berjalan lebih cepat, rapi, dan tanpa ribet.</p>
      </section>

      <section className="bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="min-h-80 transition-colors hover:bg-muted/40">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/15">
                  <HugeiconsIcon icon={service.icon} size={24} strokeWidth={2} />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3 text-left text-muted-foreground">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
