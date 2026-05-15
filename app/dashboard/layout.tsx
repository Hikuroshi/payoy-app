import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUserProfile } from "@/lib/auth/profile";
import { getDemoCustomerHref } from "@/lib/customer-demo";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUserProfile();
  const demoCustomerHref =
    profile.role === "owner"
      ? await getDemoCustomerHref(profile.id, "/dashboard/tables", "/dashboard")
      : "/dashboard";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar demoCustomerHref={demoCustomerHref} variant="inset" user={profile} />
      <SidebarInset>
        <SiteHeader user={profile} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
