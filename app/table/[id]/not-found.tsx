import Link from "next/link";
import Image from "next/image";

export default function TableNotFoundPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center text-center">
      <section className="flex flex-col w-full items-center">
        <div className="relative w-full h-64">
          <Image src="/img/Table.png" alt="Halaman tidak ditemukan" fill priority className="object-contain" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Meja tidak ditemukan</h1>
          <p className="text-muted-foreground mt-1">Periksa kembali link atau QR meja yang digunakan.</p>
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
