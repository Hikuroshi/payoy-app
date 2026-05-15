import { Footer } from "@/components/home-footer";
import { Header } from "@/components/home-header";
import { getDemoCustomerHref } from "@/lib/customer-demo";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const demoCustomerHref = await getDemoCustomerHref(undefined, "/dashboard", "/");

  return (
    <div className="flex min-h-svh flex-col">
      <Header demoCustomerHref={demoCustomerHref} />
      {children}
      <Footer />
    </div>
  );
}
