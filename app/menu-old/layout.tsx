import { Toaster } from "sonner";

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-background">
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
