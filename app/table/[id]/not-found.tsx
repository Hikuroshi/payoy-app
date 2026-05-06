import Link from "next/link";

export default function TableNotFoundPage() {
  return (
    <div>
      <h1>Meja tidak ditemukan</h1>
      <p>Periksa kembali link atau QR meja yang digunakan.</p>
      <Link href="/">Kembali ke beranda</Link>
    </div>
  );
}
