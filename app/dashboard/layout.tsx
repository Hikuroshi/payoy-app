import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUserProfile } from "@/lib/auth/profile";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUserProfile();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={profile} />
      <SidebarInset>
        <SiteHeader user={profile} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
