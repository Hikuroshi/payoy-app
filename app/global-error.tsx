"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="id">
      <body>
        <h1>Terjadi kesalahan</h1>
        <p>Aplikasi mengalami masalah yang tidak terduga.</p>
        <button onClick={() => unstable_retry()}>Coba lagi</button>
      </body>
    </html>
  );
}
