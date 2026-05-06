import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Halaman tidak ditemukan</h1>
      <p>Halaman yang kamu cari tidak tersedia.</p>
      <Link href="/">Kembali ke beranda</Link>
    </div>
  );
}
