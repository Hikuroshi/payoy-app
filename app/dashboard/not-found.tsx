import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div>
      <h1>Data tidak ditemukan</h1>
      <p>Halaman dashboard yang kamu cari tidak tersedia.</p>
      <Link href="/dashboard">Kembali ke dashboard</Link>
    </div>
  );
}
