import { Footer } from "@/components/home-footer";
import { Header } from "@/components/home-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
