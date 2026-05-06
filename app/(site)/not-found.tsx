import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div>
      <h1>Halaman tidak ditemukan</h1>
      <p>Halaman situs yang kamu buka tidak tersedia.</p>
      <Link href="/">Kembali ke beranda</Link>
    </div>
  );
}
