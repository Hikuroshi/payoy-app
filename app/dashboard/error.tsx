"use client";

import { useEffect } from "react";

export default function DashboardError({
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
      <p>Dashboard gagal dimuat.</p>
      <button onClick={() => unstable_retry()}>Coba lagi</button>
    </div>
  );
}
