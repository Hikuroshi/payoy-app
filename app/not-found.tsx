import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-center">
      <section className="flex w-full flex-col items-center">
        <div className="relative w-full h-64">
          <Image src="/img/404.png" alt="Halaman tidak ditemukan" fill priority className="object-contain" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Halaman tidak ditemukan</h1>
          <p className="mt-1 text-muted-foreground">Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>
          <div className="mt-6">
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-10 text-sm font-medium text-primary-foreground shadow transition-colors hover:opacity-90">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
