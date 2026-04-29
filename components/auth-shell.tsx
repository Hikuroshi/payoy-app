import Image from "next/image";
import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="flex flex-col gap-8 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <Image src="/img/payoy-logo.png" alt="Payoy" width={28} height={28} className="size-7 object-contain" />
            <span>Payoy!</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </section>

      <AuthVisual />
    </main>
  );
}

function AuthVisual() {
  return (
    <section className="relative hidden bg-muted lg:block">
      <Image src="/img/cover.png" alt="Operasional kuliner Payoy" fill className="object-cover" sizes="50vw" priority />
    </section>
  );
}
