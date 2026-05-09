"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getTableMenuPathFromQr } from "@/lib/table-qr";

type ScannerState = "starting" | "ready" | "invalid" | "redirecting" | "error";
type ScannerInstance = Pick<import("html5-qrcode").Html5Qrcode, "stop" | "clear">;

function getScannerMessage(state: ScannerState) {
  if (state === "starting") {
    return "Menyiapkan kamera...";
  }

  if (state === "redirecting") {
    return "QR meja ditemukan. Membuka menu...";
  }

  return "Arahkan kamera ke QR meja untuk membuka menu.";
}

export default function ScanPage() {
  const router = useRouter();
  const scannerRef = React.useRef<ScannerInstance | null>(null);
  const redirectingRef = React.useRef(false);
  const [attempt, setAttempt] = React.useState(0);
  const [scannerState, setScannerState] = React.useState<ScannerState>("starting");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const stopScanner = React.useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;

    if (!scanner) {
      return;
    }

    try {
      await scanner.stop();
    } catch {}

    try {
      await scanner.clear();
    } catch {}
  }, []);

  const handleScanSuccess = React.useCallback(
    async (decodedText: string) => {
      if (redirectingRef.current) {
        return;
      }

      const destination = getTableMenuPathFromQr(decodedText);

      if (!destination) {
        setScannerState("invalid");
        setErrorMessage("QR tidak dikenali. Gunakan QR meja dari Payoy.");
        return;
      }

      redirectingRef.current = true;
      setScannerState("redirecting");
      setErrorMessage(null);
      await stopScanner();
      router.replace(destination);
    },
    [router, stopScanner],
  );

  React.useEffect(() => {
    let cancelled = false;

    async function startScanner(preferredCamera: MediaTrackConstraints) {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (cancelled) {
        return;
      }

      const scanner = new Html5Qrcode("table-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        preferredCamera,
        {
          aspectRatio: 1,
          fps: 10,
          qrbox: { width: 280, height: 280 },
        },
        (decodedText) => {
          void handleScanSuccess(decodedText);
        },
        () => {},
      );
    }

    async function setupScanner() {
      setScannerState("starting");
      setErrorMessage(null);
      redirectingRef.current = false;
      await stopScanner();

      try {
        await startScanner({ facingMode: { exact: "environment" } });

        if (!cancelled) {
          setScannerState("ready");
        }
      } catch {
        try {
          await stopScanner();
          await startScanner({ facingMode: "environment" });

          if (!cancelled) {
            setScannerState("ready");
          }
        } catch {
          if (!cancelled) {
            setScannerState("error");
            setErrorMessage("Kamera tidak bisa dibuka. Izinkan akses kamera lalu coba lagi.");
          }
        }
      }
    }

    void setupScanner();

    return () => {
      cancelled = true;
      void stopScanner();
    };
  }, [attempt, handleScanSuccess, stopScanner]);

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-xl font-semibold">Scan QR meja</h1>
          <p className="text-sm text-muted-foreground">Gunakan kamera belakang untuk memindai QR meja Payoy.</p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-muted">
          <div id="table-qr-reader" className={cn("min-h-88 w-full [&>div]:border-0 [&_img]:mx-auto [&_section]:border-0 [&_video]:aspect-square [&_video]:w-full [&_video]:object-cover", scannerState === "redirecting" && "opacity-60")} />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {getScannerMessage(scannerState)}
          </p>
          {errorMessage ? (
            <p className="text-sm text-destructive" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Button disabled={scannerState === "starting" || scannerState === "redirecting"} onClick={() => setAttempt((value) => value + 1)} type="button" variant="outline">
            {scannerState === "starting" ? (
              <>
                <Spinner data-icon="inline-start" />
                Menyiapkan kamera
              </>
            ) : scannerState === "redirecting" ? (
              <>
                <Spinner data-icon="inline-start" />
                Membuka menu meja
              </>
            ) : (
              "Coba scan lagi"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}
