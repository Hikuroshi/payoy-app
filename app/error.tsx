"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>Terjadi kesalahan</h1>
      <p>Halaman ini gagal dimuat.</p>
      <button onClick={() => unstable_retry()}>Coba lagi</button>
    </div>
  );
}
