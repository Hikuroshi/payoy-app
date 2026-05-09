import Link from "next/link";
import Image from "next/image";

export default function TableNotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-center">
      <section className="flex w-full flex-col items-center">
        <div className="relative w-full h-64">
          <Image src="/img/Table.png" alt="Meja tidak ditemukan" fill priority className="object-contain" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Meja tidak ditemukan</h1>
          <p className="mt-1 text-muted-foreground">QR meja tidak valid atau meja sudah tidak tersedia.</p>
          <div className="mt-6 text-center">
            <Link href="/scan" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-10 text-sm font-medium text-primary-foreground shadow transition-colors hover:opacity-90">
              Scan ulang QR meja
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
